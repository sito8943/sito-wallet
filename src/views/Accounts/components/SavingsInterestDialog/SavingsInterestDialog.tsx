import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { Button, Dialog } from "@sito/dashboard-app";

// components
import { SavingsInterestFields } from "../SavingsInterestFields";

// types
import type { SavingsInterestDialogPropsType } from "./types";

/**
 * Interest settings on top of the account dialog. Fields write straight into
 * the account form, so values stay there until the account is submitted.
 */
export function SavingsInterestDialog(props: SavingsInterestDialogPropsType) {
  const { open, onClose, ...fieldsProps } = props;
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      handleClose={onClose}
      mobileFullScreen
      title={t("_entities:account.interest.title")}
      containerClassName="!z-60"
    >
      <SavingsInterestFields {...fieldsProps} />
      <div className="dialog-actions justify-end">
        <Button
          type="button"
          variant="submit"
          color="primary"
          onClick={onClose}
        >
          {t("_entities:account.interest.done")}
        </Button>
      </div>
    </Dialog>
  );
}
