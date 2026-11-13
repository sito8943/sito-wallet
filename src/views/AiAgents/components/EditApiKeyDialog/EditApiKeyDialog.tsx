// @sito/dashboard-app
import { FormDialog } from "@sito/dashboard-app";

// components
import { ApiKeyFormFields } from "../ApiKeyFormFields";

// types
import type { ApiKeyFormType, EditApiKeyDialogPropsType } from "../../types";

/** Renames a key or changes its access level and areas; the secret stays. */
export function EditApiKeyDialog(props: EditApiKeyDialogPropsType) {
  const { openForKey, ...dialogProps } = props;
  const { control, isLoading } = dialogProps;
  void openForKey;

  return (
    <FormDialog<ApiKeyFormType> {...dialogProps}>
      <ApiKeyFormFields control={control} isLoading={isLoading} />
    </FormDialog>
  );
}
