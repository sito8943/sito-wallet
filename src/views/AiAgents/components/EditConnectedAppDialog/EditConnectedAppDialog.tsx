// @sito/dashboard-app
import { FormDialog } from "@sito/dashboard-app";

// components
import { ConnectedAppFormFields } from "../ConnectedAppFormFields";

// types
import type {
  ConnectedAppFormType,
  EditConnectedAppDialogPropsType,
} from "../../types";

/** Changes a connected app's access level and areas. */
export function EditConnectedAppDialog(props: EditConnectedAppDialogPropsType) {
  const { openForGrant, ...dialogProps } = props;
  const { control, isLoading } = dialogProps;
  void openForGrant;

  return (
    <FormDialog<ConnectedAppFormType> {...dialogProps}>
      <ConnectedAppFormFields control={control} isLoading={isLoading} />
    </FormDialog>
  );
}
