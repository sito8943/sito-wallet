import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Button } from "@sito/dashboard-app";

import { TextLogo } from "components";
import { AppRoutes, randomBackgroundColor } from "lib";

import "./styles.css";

const color: "primary" | "secondary" | "tertiary" | "quaternary" =
  randomBackgroundColor();

export function ConfirmEmailError() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [appear, setAppear] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setAppear(true);
    }, 500);
  }, []);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className={`${appear ? "blur-appear" : ""} auth-form`}>
        <div
          className={`mb-5 flex flex-col gap-10 justify-start items-start w-full transition-all duration-500 ease-in-out delay-200 ${
            appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"
          }`}
        >
          <TextLogo variant={color} />
          <h1 className="auth-title">
            {t("_pages:auth.confirmEmailError.title")}
          </h1>
        </div>
        <p
          className={`w-full mb-4 transition-all duration-500 ease-in-out delay-300 ${
            appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"
          }`}
        >
          {t("_pages:auth.confirmEmailError.description")}
        </p>
        <div
          className={`flex max-xs:flex-col gap-3 w-full transition-all duration-500 ease-in-out delay-[400ms] ${
            appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"
          }`}
        >
          <Button
            type="button"
            variant="submit"
            color="primary"
            className="!px-8"
            onClick={() => navigate(AppRoutes.recovery)}
            aria-label={t("_pages:auth.confirmEmailError.resend")}
          >
            {t("_pages:auth.confirmEmailError.resend")}
          </Button>
          <Button
            type="button"
            variant="outlined"
            className="!px-8"
            onClick={() => navigate(AppRoutes.signIn)}
            aria-label={t("_pages:auth.confirmEmailError.toSignIn")}
          >
            {t("_pages:auth.confirmEmailError.toSignIn")}
          </Button>
        </div>
      </div>
    </div>
  );
}
