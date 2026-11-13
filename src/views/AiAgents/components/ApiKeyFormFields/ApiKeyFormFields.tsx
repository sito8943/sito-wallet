import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useFormState, useWatch } from "react-hook-form";

// @sito/dashboard-app
import { State, TabsLayout, TextInput } from "@sito/dashboard-app";

// lib
import { API_KEY_NAME_MAX_LENGTH, MCP_AREAS } from "lib";

// components
import { McpAccessSelector, McpAreaSelector } from "components";

// constants
import { API_KEY_FORM_TAB } from "../../constants";

// utils
import { getApiKeyAreasErrorKey, getApiKeyNameErrorKey } from "../../utils";

// types
import type { ApiKeyFormFieldsPropsType, ApiKeyFormTabId } from "../../types";

/**
 * Name (1..60 chars) on top; access level and areas on two tabs. Both tab
 * panels stay mounted (the inactive one hidden) so every field validates.
 */
export function ApiKeyFormFields(props: ApiKeyFormFieldsPropsType) {
  const { control, isLoading = false } = props;
  const { t } = useTranslation();
  const [tab, setTab] = useState<ApiKeyFormTabId>(API_KEY_FORM_TAB.access);
  const { errors, submitCount } = useFormState({ control });
  const areas = useWatch({ control, name: "areas" }) ?? [];

  // After a failed submit, show the areas tab if that is what is wrong.
  useEffect(() => {
    if (submitCount && errors.areas) setTab(API_KEY_FORM_TAB.areas);
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
      <TabsLayout<ApiKeyFormTabId>
        tabs={[
          {
            id: API_KEY_FORM_TAB.access,
            label: t("_pages:aiAgents.access.label"),
            content: null,
          },
          {
            id: API_KEY_FORM_TAB.areas,
            label: t("_pages:aiAgents.keys.dialog.areasTab", {
              count: areas.length,
              total: MCP_AREAS.length,
            }),
            content: null,
          },
        ]}
        currentTab={tab}
        useLinks={false}
        onTabChange={setTab}
        tabsContainerClassName="ai-agents-key-form-tabs"
      />
      <div
        className="ai-agents-key-form-panel"
        hidden={tab !== API_KEY_FORM_TAB.access}
      >
        <Controller
          control={control}
          name="access"
          disabled={isLoading}
          render={({ field: { value, onChange, name, disabled } }) => (
            <McpAccessSelector
              name={name}
              value={value}
              onChange={onChange}
              disabled={disabled}
            />
          )}
        />
      </div>
      <div
        className="ai-agents-key-form-panel"
        hidden={tab !== API_KEY_FORM_TAB.areas}
      >
        <Controller
          control={control}
          name="areas"
          disabled={isLoading}
          rules={{
            validate: (value) => {
              const errorKey = getApiKeyAreasErrorKey(value);
              return errorKey === null || t(errorKey);
            },
          }}
          render={({
            field: { value, onChange, name, disabled },
            fieldState: { error },
          }) => (
            <McpAreaSelector
              name={name}
              value={value ?? []}
              onChange={onChange}
              disabled={disabled}
              error={error?.message}
            />
          )}
        />
      </div>
    </>
  );
}
