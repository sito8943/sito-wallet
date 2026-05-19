import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Button,
  Loading,
  buildAuthRedirectUrl,
  isHttpError,
  useNotification,
} from "@sito/dashboard-app";

import { config } from "../../config";
import { TextLogo } from "components";
import { AppRoutes, randomBackgroundColor } from "lib";
import { useManager } from "providers";

import "./styles.css";
import type { SignUpSuccessLocationState } from "./types";
import { getAuthErrorMessage } from "./getAuthErrorMessage";

const color: "primary" | "secondary" | "tertiary" | "quaternary" =
  randomBackgroundColor();

export function SignUpSuccess() {
  const { t } = useTranslation();
  const manager = useManager();
  const location = useLocation();
  const navigate = useNavigate();
  const { showErrorNotification, showSuccessNotification } = useNotification();
  const [appear, setAppear] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const locationState = location.state as SignUpSuccessLocationState | null;
  const email = locationState?.email?.trim() ?? "";
  const confirmRedirectTo = buildAuthRedirectUrl(
    AppRoutes.confirmEmailSuccess,
    config.thisUrl || undefined,
  );

  const onResendConfirmEmail = async () => {
    if (email.length === 0) {
      navigate(AppRoutes.recovery);
      return;
    }

    setIsResending(true);
    try {
      const response = await manager.AuthApi.resendConfirmEmail({
        email,
        redirectTo: confirmRedirectTo,
      });
      showSuccessNotification({
        message:
          response?.message || t("_pages:auth.recovery.confirmationSent"),
      });
    } catch (error) {
      const message = isHttpError(error)
        ? getAuthErrorMessage(t, error.status, "signUpSuccess")
        : getAuthErrorMessage(t);

      showErrorNotification({ message });
    } finally {
      setIsResending(false);
    }
  };

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
          <h1 className="auth-title">{t("_pages:auth.signUpSuccess.title")}</h1>
        </div>
        <p
          className={`w-full mb-4 transition-all duration-500 ease-in-out delay-300 ${
            appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"
          }`}
        >
          {t("_pages:auth.signUpSuccess.description")}
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
            disabled={isResending}
            onClick={() => navigate(AppRoutes.signIn)}
            aria-label={t("_pages:auth.signUpSuccess.toSignIn")}
          >
            {t("_pages:auth.signUpSuccess.toSignIn")}
          </Button>
          <Button
            type="button"
            variant="outlined"
            className="!px-8"
            disabled={isResending}
            onClick={() => {
              void onResendConfirmEmail();
            }}
            aria-label={t("_pages:auth.signUpSuccess.resend")}
          >
            {isResending && (
              <Loading
                className="w-auto!"
                color="stroke-primary"
                loaderClass="!w-6"
                strokeWidth="6"
              />
            )}
            {t("_pages:auth.signUpSuccess.resend")}
          </Button>
        </div>
      </div>
    </div>
  );
}
