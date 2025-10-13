import { useTranslation } from "react-i18next";
import { FieldValues } from "react-hook-form";

// components
import { Dialog } from "./Dialog";
import { Button, Loading } from "components";

// types
import { FormDialogPropsType } from "./types.ts";

export const FormDialog = <TInput extends FieldValues, TError extends Error>(
  props: FormDialogPropsType<TInput, TError>
) => {
  const { t } = useTranslation();
  const {
    children,
    handleSubmit,
    onSubmit,
    handleClose,
    isLoading = false,
    buttonEnd = true,
    ...rest
  } = props;

  return (
    <Dialog {...rest} handleClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-container">{children}</div>
        <div className={`flex gap-2 mt-2 ${buttonEnd ? "justify-end" : ""}`}>
          <Button
            type="submit"
            color="primary"
            variant="submit"
            className="!px-6"
            disabled={isLoading}
            name={t("_accessibility:buttons.submit")}
            aria-label={t("_accessibility:ariaLabels.submit")}
          >
            {isLoading ? <Loading color="text-dark" className="mt-1" /> : null}
            {t("_accessibility:buttons.submit")}
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
      </form>
    </Dialog>
  );
};
