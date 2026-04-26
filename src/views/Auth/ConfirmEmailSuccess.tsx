import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "@sito/dashboard-app";

import { TextLogo } from "components";
import { AppRoutes, AuthRouteQueryParam, randomBackgroundColor } from "lib";

import "./styles.css";

const color: "primary" | "secondary" | "tertiary" | "quaternary" =
  randomBackgroundColor();

export function ConfirmEmailSuccess() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [appear, setAppear] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const rawHash = location.hash.startsWith("#")
      ? location.hash.slice(1)
      : location.hash;
    const hashParams = new URLSearchParams(rawHash);

    const hasError =
      searchParams.has(AuthRouteQueryParam.error) ||
      searchParams.has(AuthRouteQueryParam.errorDescription) ||
      hashParams.has(AuthRouteQueryParam.error) ||
      hashParams.has(AuthRouteQueryParam.errorDescription);

    if (hasError) {
      navigate(AppRoutes.confirmEmailError, { replace: true });
      return;
    }
  }, [location.hash, location.search, navigate]);

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
            {t("_pages:auth.confirmEmailSuccess.title")}
          </h1>
        </div>
        <p
          className={`w-full mb-4 transition-all duration-500 ease-in-out delay-300 ${
            appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"
          }`}
        >
          {t("_pages:auth.confirmEmailSuccess.description")}
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
            onClick={() => navigate(AppRoutes.signIn)}
            aria-label={t("_pages:auth.confirmEmailSuccess.toSignIn")}
          >
            {t("_pages:auth.confirmEmailSuccess.toSignIn")}
          </Button>
        </div>
      </div>
    </div>
  );
}
