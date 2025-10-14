import { useTranslation } from "react-i18next";

// providers
import { useAuth, Button } from "@sito/dashboard-app";

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

  const { setGuestMode } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="big-appear w-md flex flex-col gap-20">
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
            <Button
              color="primary"
              className="!px-8"
              variant="outlined"
              onClick={() => (window.location.href = "/auth/sign-in")}
              aria-label={t("_accessibility:ariaLabels.skip")}
            >
              {t("_accessibility:buttons.skip")}
            </Button>
            <Button
              color="primary"
              className="!px-8"
              variant="outlined"
              onClick={() => onClickNext()}
              aria-label={t("_accessibility:ariaLabels.next")}
            >
              {t("_accessibility:buttons.next")}
            </Button>
          </>
        ) : (
          <>
            <Button
              color="primary"
              className="!px-8"
              variant="outlined"
              onClick={() => {
                setGuestMode(true);
                window.location.href = "/";
              }}
              aria-label={t("_accessibility:ariaLabels.start")}
            >
              {t("_accessibility:buttons.startAsGuest")}
            </Button>
            <Button
              color="primary"
              variant="submit"
              className="!px-8"
              aria-label={t("_accessibility:ariaLabels.start")}
              onClick={() => (window.location.href = "/auth/sign-in")}
            >
              {t("_accessibility:buttons.signIn")}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
