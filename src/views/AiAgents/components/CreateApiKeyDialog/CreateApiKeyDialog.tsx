import { useTranslation } from "react-i18next";
import { Controller } from "react-hook-form";

// @sito/dashboard-app
import { FormDialog, State, TextInput } from "@sito/dashboard-app";

// lib
import { API_KEY_NAME_MAX_LENGTH } from "lib";

// components
import { McpAccessSelector } from "components";

// utils
import { getApiKeyNameErrorKey } from "../../utils";

// types
import type {
  CreateApiKeyDialogPropsType,
  CreateApiKeyFormType,
} from "../../types";

/** Asks for the key name (1..60 chars) and its access level. */
export function CreateApiKeyDialog(props: CreateApiKeyDialogPropsType) {
  const { control, isLoading } = props;
  const { t } = useTranslation();

  return (
    <FormDialog<CreateApiKeyFormType> {...props}>
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
            className="ai-agents-access-selector"
          />
        )}
      />
    </FormDialog>
  );
}
