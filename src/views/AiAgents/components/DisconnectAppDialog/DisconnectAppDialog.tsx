import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { ConfirmationDialog } from "@sito/dashboard-app";

// types
import type { DisconnectAppDialogPropsType } from "../../types";

export function DisconnectAppDialog(props: DisconnectAppDialogPropsType) {
  const { target, openForGrant, ...dialogProps } = props;
  const { t } = useTranslation();
  void openForGrant;

  return (
    <ConfirmationDialog {...dialogProps}>
      {target && (
        <p className="ai-agents-text">
          {t("_pages:aiAgents.apps.disconnect.message")}
        </p>
      )}
    </ConfirmationDialog>
  );
}
