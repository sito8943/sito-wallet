import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import {
  AuthResultView,
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

  return (
    <AuthResultView
      logo={<TextLogo variant={color} />}
      title={t("_pages:auth.signUpSuccess.title")}
      description={t("_pages:auth.signUpSuccess.description")}
      actions={
        <>
          <Button
            type="button"
            variant="submit"
            color="primary"
            className="auth-action-button"
            disabled={isResending}
            onClick={() => navigate(AppRoutes.signIn)}
            aria-label={t("_pages:auth.signUpSuccess.toSignIn")}
          >
            {t("_pages:auth.signUpSuccess.toSignIn")}
          </Button>
          <Button
            type="button"
            variant="outlined"
            className="auth-action-button"
            disabled={isResending}
            onClick={() => {
              void onResendConfirmEmail();
            }}
            aria-label={t("_pages:auth.signUpSuccess.resend")}
          >
            {isResending && (
              <Loading
                className="auth-loading"
                color="stroke-primary"
                loaderClass="auth-loading-icon"
                strokeWidth="6"
              />
            )}
            {t("_pages:auth.signUpSuccess.resend")}
          </Button>
        </>
      }
    />
  );
}
