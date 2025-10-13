import { useTranslation } from "react-i18next";
import { FieldValues } from "react-hook-form";

// components
import { Button, Loading } from "components";

// types
import { FormContainerPropsType } from "./types";

// styles
import "./styles.css";

export const FormContainer = <TInput extends FieldValues, TError extends Error>(
  props: FormContainerPropsType<TInput, TError>
) => {
  const { t } = useTranslation();
  const {
    children,
    handleSubmit,
    onSubmit,
    isLoading = false,
    buttonEnd = true,
    reset,
  } = props;

  return (
    <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
      {children}
      <div className={`flex gap-2 mt-5 ${buttonEnd ? "justify-end" : ""}`}>
        <Button
          type="submit"
          color="primary"
          variant="submit"
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
          onClick={() => reset?.()}
          name={t("_accessibility:buttons.cancel")}
          aria-label={t("_accessibility:ariaLabels.cancel")}
        >
          {t("_accessibility:buttons.cancel")}
        </Button>
      </div>
    </form>
  );
};
