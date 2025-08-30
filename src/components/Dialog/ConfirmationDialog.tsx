import { useTranslation } from "react-i18next";

// @sito/dashboard

// components
import { Dialog } from "./Dialog";
import { Loading } from "components";

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
        <button
          disabled={isLoading}
          onClick={handleSubmit}
          className="button submit primary"
          name={t("_accessibility:buttons.ok")}
          aria-label={t("_accessibility:ariaLabels.ok")}
        >
          {isLoading ? (
            <Loading color="text-text-mute" className="mt-1" />
          ) : null}
          {t("_accessibility:buttons.ok")}
        </button>
        <button
          type="button"
          disabled={isLoading}
          onClick={handleClose}
          className="button outlined"
          name={t("_accessibility:buttons.cancel")}
          aria-label={t("_accessibility:ariaLabels.cancel")}
        >
          {t("_accessibility:buttons.cancel")}
        </button>
      </div>
    </Dialog>
  );
};
