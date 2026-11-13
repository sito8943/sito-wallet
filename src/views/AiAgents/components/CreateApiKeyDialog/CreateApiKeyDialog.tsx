// @sito/dashboard-app
import { FormDialog } from "@sito/dashboard-app";

// components
import { ApiKeyFormFields } from "../ApiKeyFormFields";

// types
import type { ApiKeyFormType, CreateApiKeyDialogPropsType } from "../../types";

/** Asks for the key name (1..60 chars), its access level and areas. */
export function CreateApiKeyDialog(props: CreateApiKeyDialogPropsType) {
  const { control, isLoading } = props;

  return (
    <FormDialog<ApiKeyFormType> {...props}>
      <ApiKeyFormFields control={control} isLoading={isLoading} />
    </FormDialog>
  );
}
