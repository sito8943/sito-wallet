import { useTranslation } from "react-i18next";

import {
  AuthUpdatePasswordView,
  isHttpError,
  useNotification,
} from "@sito/dashboard-app";

import { TextLogo } from "components";
import { AppRoutes, randomBackgroundColor } from "lib";
import { useManager } from "providers";

import { getAuthErrorMessage } from "./getAuthErrorMessage";

const color: "primary" | "secondary" | "tertiary" | "quaternary" =
  randomBackgroundColor();

export function UpdatePassword() {
  const { t } = useTranslation();
  const manager = useManager();
  const { showErrorNotification, showSuccessNotification } = useNotification();

  return (
    <AuthUpdatePasswordView
      authApi={manager.AuthApi}
      logo={<TextLogo variant={color} />}
      title={t("_pages:auth.updatePassword.title")}
      showBackButton
      backTo={AppRoutes.signIn}
      backButtonLabel={t("_accessibility:buttons.back")}
      passwordLabel={t("_entities:user.password.label")}
      confirmPasswordLabel={t("_entities:user.rPassword.label")}
      passwordRequiredMessage={t("_entities:user.password.required")}
      confirmPasswordRequiredMessage={t("_entities:user.password.required")}
      passwordMismatchMessage={t("_accessibility:errors.differentPasswords")}
      submitLabel={t("_pages:auth.updatePassword.submit")}
      submitAriaLabel={t("_pages:auth.updatePassword.submit")}
      signInQuestion={t("_pages:auth.updatePassword.toLogin.question")}
      signInLabel={t("_pages:auth.updatePassword.toLogin.link")}
      signInTo={AppRoutes.signIn}
      onSuccess={() =>
        showSuccessNotification({
          message: t("_pages:auth.updatePassword.sent"),
        })
      }
      onInvalidToken={() =>
        showErrorNotification({
          message: t("_pages:auth.updatePassword.invalidToken"),
        })
      }
      onPasswordMismatch={() =>
        showErrorNotification({
          message: t("_accessibility:errors.differentPasswords"),
        })
      }
      onError={(error) => {
        const message = isHttpError(error)
          ? getAuthErrorMessage(t, error.status, "updatePassword")
          : getAuthErrorMessage(t);

        showErrorNotification({ message });
      }}
    />
  );
}
