import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import {
  AuthRecoveryView,
  buildAuthRedirectUrl,
  isHttpError,
  useNotification,
} from "@sito/dashboard-app";
import type { RecoveryFormType } from "@sito/dashboard-app";

// config
import { config } from "../../config";

// lib
import { AppRoutes } from "lib";

// providers
import { useManager } from "providers";

import { getAuthErrorMessage } from "./getAuthErrorMessage";

/**
 * Recovery page
 * @returns Recovery page component
 */
export function Recovery() {
  const { t } = useTranslation();
  const manager = useManager();
  const { showErrorNotification, showSuccessNotification } = useNotification();

  const forgotRedirectTo = buildAuthRedirectUrl(
    AppRoutes.resetPassword,
    config.thisUrl || undefined,
  );
  const confirmRedirectTo = buildAuthRedirectUrl(
    AppRoutes.confirmEmailSuccess,
    config.thisUrl || undefined,
  );

  const onForgotPassword = async ({ email }: RecoveryFormType) => {
    const response = await manager.AuthApi.forgotPassword({
      email,
      redirectTo: forgotRedirectTo,
    });
    showSuccessNotification({
      message: response?.message || t("_pages:auth.recovery.sent"),
    });
  };

  const onResendConfirmEmail = async ({ email }: RecoveryFormType) => {
    const response = await manager.AuthApi.resendConfirmEmail({
      email,
      redirectTo: confirmRedirectTo,
    });
    showSuccessNotification({
      message: response?.message || t("_pages:auth.recovery.confirmationSent"),
    });
  };

  return (
    <AuthRecoveryView
      title={t("_pages:auth.recovery.title")}
      showBackButton
      backTo={AppRoutes.signIn}
      backButtonLabel={t("_accessibility:buttons.back")}
      emailLabel={t("_entities:user.email.label")}
      emailRequiredMessage={t("_entities:user.email.required")}
      submitLabel={t("_pages:auth.recovery.submit")}
      submitAriaLabel={t("_pages:auth.recovery.submit")}
      signInQuestion={t("_pages:auth.recovery.toLogin.question")}
      signInLabel={t("_pages:auth.recovery.toLogin.link")}
      signInTo={AppRoutes.signIn}
      secondaryActionLabel={t("_pages:auth.recovery.resendConfirm")}
      secondaryActionAriaLabel={t("_pages:auth.recovery.resendConfirm")}
      onSubmit={onForgotPassword}
      onSecondaryAction={onResendConfirmEmail}
      onError={(error, { action }) => {
        const message = isHttpError(error)
          ? getAuthErrorMessage(
              t,
              error.status,
              action === "secondary" ? "recovery" : undefined,
            )
          : getAuthErrorMessage(t);

        showErrorNotification({ message });
      }}
    />
  );
}
