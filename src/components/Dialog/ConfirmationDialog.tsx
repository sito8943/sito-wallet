import { useTranslation } from "react-i18next";

// @sito/dashboard

// components
import { Dialog } from "./Dialog";
import { Button, Loading } from "components";

// types
import { ConfirmationDialogPropsType } from "./types";

export const ConfirmationDialog = (props: ConfirmationDialogPropsType) => {
  const { t } = useTranslation();

  const {
    children,
    handleSubmit,
    handleClose,
    isLoading = false,
    ...rest
  } = props;

  return (
    <Dialog {...rest} handleClose={handleClose}>
      {children}
      <div className="flex gap-2 mt-5">
        <Button
          color="primary"
          variant="submit"
          disabled={isLoading}
          onClick={handleSubmit}
          name={t("_accessibility:buttons.ok")}
          aria-label={t("_accessibility:ariaLabels.ok")}
        >
          {isLoading ? (
            <Loading color="text-text-mute" className="mt-1" />
          ) : null}
          {t("_accessibility:buttons.ok")}
        </Button>
        <Button
          type="button"
          variant="outlined"
          disabled={isLoading}
          onClick={handleClose}
          name={t("_accessibility:buttons.cancel")}
          aria-label={t("_accessibility:ariaLabels.cancel")}
        >
          {t("_accessibility:buttons.cancel")}
        </Button>
      </div>
    </Dialog>
  );
};
