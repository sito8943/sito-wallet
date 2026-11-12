import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { ConfirmationDialog } from "@sito/dashboard-app";

// types
import type { RevokeApiKeyDialogPropsType } from "../../types";

export function RevokeApiKeyDialog(props: RevokeApiKeyDialogPropsType) {
  const { target, openForKey, ...dialogProps } = props;
  const { t } = useTranslation();
  void openForKey;

  return (
    <ConfirmationDialog {...dialogProps}>
      {target && (
        <p className="ai-agents-text">
          {t("_pages:aiAgents.keys.revoke.message")}
        </p>
      )}
    </ConfirmationDialog>
  );
}
