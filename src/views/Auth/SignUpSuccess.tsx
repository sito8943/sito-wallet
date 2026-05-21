import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import {
  AuthSignUpConfirmationView,
  buildAuthRedirectUrl,
  isHttpError,
  useNotification,
} from "@sito/dashboard-app";

import { config } from "../../config";
import { TextLogo } from "components";
import { AppRoutes, randomBackgroundColor } from "lib";
import { useManager } from "providers";

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
    <AuthSignUpConfirmationView
      logo={<TextLogo variant={color} />}
      title={t("_pages:auth.signUpSuccess.title")}
      showBackButton
      backTo={AppRoutes.signIn}
      backButtonLabel={t("_accessibility:buttons.back")}
      description={t("_pages:auth.signUpSuccess.description")}
      toSignInLabel={t("_pages:auth.signUpSuccess.toSignIn")}
      toSignInAriaLabel={t("_pages:auth.signUpSuccess.toSignIn")}
      resendLabel={t("_pages:auth.signUpSuccess.resend")}
      resendAriaLabel={t("_pages:auth.signUpSuccess.resend")}
      isResending={isResending}
      onSignIn={() => navigate(AppRoutes.signIn)}
      onResendConfirmEmail={onResendConfirmEmail}
    />
  );
}
