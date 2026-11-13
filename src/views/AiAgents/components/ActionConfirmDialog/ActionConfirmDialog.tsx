import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { Dialog, DialogActions } from "@sito/dashboard-app";

// types
import type { ActionConfirmDialogPropsType } from "../../types";

/**
 * Like ConfirmationDialog, but the primary button names the action
 * ("Revoke", "Disconnect") instead of a generic "OK".
 */
export function ActionConfirmDialog(props: ActionConfirmDialogPropsType) {
  const {
    children,
    confirmLabel,
    handleSubmit,
    handleClose,
    isLoading = false,
    ...dialogProps
  } = props;
  const { t } = useTranslation();

  return (
    <Dialog
      {...dialogProps}
      handleClose={handleClose}
      onSubmit={handleSubmit}
      initialFocus="submit"
    >
      {children}
      <DialogActions
        primaryText={confirmLabel}
        cancelText={t("_accessibility:buttons.cancel")}
        onCancel={handleClose}
        isLoading={isLoading}
        disabled={isLoading}
        primaryType="submit"
        containerClassName="mt-5"
        primaryName={confirmLabel}
        primaryAriaLabel={confirmLabel}
        cancelName={t("_accessibility:buttons.cancel")}
        cancelAriaLabel={t("_accessibility:ariaLabels.cancel")}
      />
    </Dialog>
  );
}
