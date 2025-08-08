import { useTranslation } from "react-i18next";

// types
import { StepPropsType } from "./types";

export const Step = (props: StepPropsType) => {
  const {
    translation,
    onClickNext,
    image = "",
    alt = "",
    final = false,
  } = props;

  const { t } = useTranslation();

  return (
    <div className="appear w-md flex flex-col gap-20">
      <img src={image} alt={alt} />
      <h2 className="text-5xl text-center leading-16">
        {t(`_pages:onboarding.${translation}.title`)}
      </h2>
      <p className="text-center !text-lg">
        {t(`_pages:onboarding.${translation}.body`)}
      </p>
      <div className="flex gap-5 items-center justify-center">
        {!final ? (
          <>
            <button
              onClick={() => (window.location.href = "/auth/sign-in")}
              aria-label={t("_accessibility:ariaLabels.skip")}
              className="button !px-8 primary outlined"
            >
              {t("_accessibility:buttons.skip")}
            </button>
            <button
              onClick={() => onClickNext()}
              aria-label={t("_accessibility:ariaLabels.next")}
              className="button !px-8 primary submit"
            >
              {t("_accessibility:buttons.next")}
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => (window.location.href = "/")}
              aria-label={t("_accessibility:ariaLabels.start")}
              className="button !px-8 primary outlined"
            >
              {t("_accessibility:buttons.startAsGuest")}
            </button>
            <button
              onClick={() => (window.location.href = "/auth/sign-in")}
              aria-label={t("_accessibility:ariaLabels.start")}
              className="button !px-8 primary submit"
            >
              {t("_accessibility:buttons.signIn")}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
