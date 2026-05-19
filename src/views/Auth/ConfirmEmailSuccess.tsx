import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Button,
  Loading,
  extractAuthQueryParamFromLocation,
  hasAuthErrorParamsInLocation,
} from "@sito/dashboard-app";

import { TextLogo } from "components";
import {
  AppRoutes,
  AuthRouteQueryParam,
  AuthRouteQueryParamType,
  randomBackgroundColor,
} from "lib";
import { useManager } from "providers";

import "./styles.css";

const color: "primary" | "secondary" | "tertiary" | "quaternary" =
  randomBackgroundColor();

export function ConfirmEmailSuccess() {
  const { t } = useTranslation();
  const manager = useManager();
  const location = useLocation();
  const navigate = useNavigate();
  const [appear, setAppear] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const verifyConfirmation = async () => {
      if (hasAuthErrorParamsInLocation(location.hash, location.search)) {
        navigate(AppRoutes.confirmEmailError, { replace: true });
        return;
      }

      const tokenHash = extractAuthQueryParamFromLocation(
        location.hash,
        location.search,
        AuthRouteQueryParam.tokenHash,
      );
      const tokenType = extractAuthQueryParamFromLocation(
        location.hash,
        location.search,
        AuthRouteQueryParam.type,
      );
      const normalizedTokenType = tokenType?.toLowerCase() ?? null;

      if (!tokenHash && !tokenType) {
        if (!cancelled) setIsVerifying(false);
        return;
      }

      if (!tokenHash || normalizedTokenType !== AuthRouteQueryParamType.email) {
        navigate(AppRoutes.confirmEmailError, { replace: true });
        return;
      }

      if (!cancelled) setIsVerifying(true);

      try {
        await manager.AuthApi.confirmEmail({
          tokenHash,
          type: normalizedTokenType,
        });

        if (cancelled) return;

        const shouldCleanUrl =
          location.search.length > 0 || location.hash.length > 0;
        if (shouldCleanUrl) {
          navigate(AppRoutes.confirmEmailSuccess, { replace: true });
          return;
        }

        setIsVerifying(false);
      } catch {
        if (cancelled) return;
        navigate(AppRoutes.confirmEmailError, { replace: true });
      }
    };

    void verifyConfirmation();

    return () => {
      cancelled = true;
    };
  }, [location.hash, location.search, manager, navigate]);

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
          {isVerifying ? (
            <Loading
              className="w-auto!"
              color="stroke-primary"
              loaderClass="!w-6"
              strokeWidth="6"
            />
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
}
