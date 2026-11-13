import { useTranslation } from "react-i18next";

// components
import { ActionConfirmDialog } from "../ActionConfirmDialog";

// types
import type { DisconnectAppDialogPropsType } from "../../types";

export function DisconnectAppDialog(props: DisconnectAppDialogPropsType) {
  const { target, openForGrant, ...dialogProps } = props;
  const { t } = useTranslation();
  void openForGrant;

  return (
    <ActionConfirmDialog
      {...dialogProps}
      confirmLabel={t("_pages:aiAgents.apps.disconnect.confirm")}
    >
      {target && (
        <p className="ai-agents-text">
          {t("_pages:aiAgents.apps.disconnect.message")}
        </p>
      )}
    </ActionConfirmDialog>
  );
}
