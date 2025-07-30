import { useTranslation } from "react-i18next";
import { FieldValues } from "react-hook-form";

// components
import { Dialog } from "./Dialog";
import { Loading } from "components";

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
        <div className="flex flex-col gap-5 pt-1">{children}</div>
        <div className={`flex gap-2 mt-5 ${buttonEnd ? "justify-end" : ""}`}>
          <button
            type="submit"
            className="button !px-6 submit primary"
            name={t("_accessibility:buttons.submit")}
            aria-label={t("_accessibility:ariaLabels.submit")}
          >
            {isLoading ? <Loading color="text-dark" className="mt-1" /> : null}
            {t("_accessibility:buttons.submit")}
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="button outlined"
            name={t("_accessibility:buttons.cancel")}
            aria-label={t("_accessibility:ariaLabels.cancel")}
          >
            {t("_accessibility:buttons.cancel")}
          </button>
        </div>
      </form>
    </Dialog>
  );
};
