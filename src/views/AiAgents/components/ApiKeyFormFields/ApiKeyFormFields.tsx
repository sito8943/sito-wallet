import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useController, useFormState } from "react-hook-form";

// @sito/dashboard-app
import { State, TextInput } from "@sito/dashboard-app";

// lib
import { API_KEY_NAME_MAX_LENGTH } from "lib";

// components
import {
  MCP_PERMISSION_TAB,
  McpPermissionTabs,
  type McpPermissionTabId,
} from "components";

// utils
import { getApiKeyAreasErrorKey, getApiKeyNameErrorKey } from "../../utils";

// types
import type { ApiKeyFormFieldsPropsType } from "../../types";

/** Name (1..60 chars) on top, then the access level and areas tabs. */
export function ApiKeyFormFields(props: ApiKeyFormFieldsPropsType) {
  const { control, isLoading = false } = props;
  const { t } = useTranslation();
  const [tab, setTab] = useState<McpPermissionTabId>(MCP_PERMISSION_TAB.access);
  const { errors, submitCount } = useFormState({ control });

  const { field: accessField } = useController({
    control,
    name: "access",
    disabled: isLoading,
  });
  const { field: areasField, fieldState: areasState } = useController({
    control,
    name: "areas",
    disabled: isLoading,
    rules: {
      validate: (value) => {
        const errorKey = getApiKeyAreasErrorKey(value);
        return errorKey === null || t(errorKey);
      },
    },
  });

  // After a failed submit, show the areas tab if that is what is wrong.
  useEffect(() => {
    if (submitCount && errors.areas) setTab(MCP_PERMISSION_TAB.areas);
  }, [errors.areas, submitCount]);

  return (
    <>
      <Controller
        control={control}
        name="name"
        rules={{
          validate: (value) => {
            const errorKey = getApiKeyNameErrorKey(value);
            return (
              errorKey === null || t(errorKey, { max: API_KEY_NAME_MAX_LENGTH })
            );
          },
        }}
        disabled={isLoading}
        render={({ field: { value, ...rest }, fieldState: { error } }) => (
          <TextInput
            id="apiKeyName"
            required
            autoComplete="off"
            maxLength={API_KEY_NAME_MAX_LENGTH}
            value={value ?? ""}
            label={t("_pages:aiAgents.keys.dialog.nameLabel")}
            placeholder={t("_pages:aiAgents.keys.dialog.namePlaceholder")}
            helperText={
              error?.message ?? t("_pages:aiAgents.keys.dialog.nameHelper")
            }
            state={error ? State.error : State.default}
            {...rest}
          />
        )}
      />
      <McpPermissionTabs
        name="apiKey"
        access={accessField.value}
        onAccessChange={accessField.onChange}
        areas={areasField.value ?? []}
        onAreasChange={areasField.onChange}
        areasError={areasState.error?.message}
        disabled={isLoading}
        tab={tab}
        onTabChange={setTab}
      />
    </>
  );
}
