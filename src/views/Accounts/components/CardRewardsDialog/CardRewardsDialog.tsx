import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { Button, Dialog } from "@sito/dashboard-app";

// components
import { CardRewardsFields } from "../CardRewardsFields";

// types
import type { CardRewardsDialogPropsType } from "./types";

/**
 * Rewards settings on top of the account dialog. Fields write straight into
 * the account form, so values stay there until the account is submitted.
 */
export function CardRewardsDialog(props: CardRewardsDialogPropsType) {
  const { open, onClose, ...fieldsProps } = props;
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      handleClose={onClose}
      mobileFullScreen
      title={t("_entities:account.rewards.title")}
      containerClassName="!z-60"
    >
      <CardRewardsFields {...fieldsProps} />
      <div className="dialog-actions justify-end">
        <Button
          type="button"
          variant="submit"
          color="primary"
          onClick={onClose}
        >
          {t("_entities:account.rewards.done")}
        </Button>
      </div>
    </Dialog>
  );
}
