import { useTranslation } from "react-i18next";

// components
import { ActionConfirmDialog } from "../ActionConfirmDialog";

// types
import type { RevokeApiKeyDialogPropsType } from "../../types";

export function RevokeApiKeyDialog(props: RevokeApiKeyDialogPropsType) {
  const { target, openForKey, ...dialogProps } = props;
  const { t } = useTranslation();
  void openForKey;

  return (
    <ActionConfirmDialog
      {...dialogProps}
      confirmLabel={t("_pages:aiAgents.keys.revoke.confirm")}
    >
      {target && (
        <p className="ai-agents-text">
          {t("_pages:aiAgents.keys.revoke.message")}
        </p>
      )}
    </ActionConfirmDialog>
  );
}
