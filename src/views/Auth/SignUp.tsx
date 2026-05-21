import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import type { RegisterDto } from "@sito/dashboard-app";
import {
  AuthSignUpView,
  isHttpError,
  useAuth,
  useNotification,
} from "@sito/dashboard-app";

import { AppRoutes, randomBackgroundColor } from "lib";
import { useManager } from "providers";

import "./styles.css";
import type { SignUpSuccessLocationState } from "./types";
import { getAuthErrorMessage } from "./getAuthErrorMessage";

const color: "primary" | "secondary" | "tertiary" | "quaternary" =
  randomBackgroundColor();

/**
 * Sign Page
 * @returns Sign component
 */
export function SignUp() {
  const { t } = useTranslation();
  const { setGuestMode } = useAuth();
  const { showErrorNotification } = useNotification();
  const manager = useManager();
  const navigate = useNavigate();

  return (
    <AuthSignUpView
      title={t("_pages:auth.signUp.title")}
      titleClassName="w-full text-2xl md:text-3xl mb-1"
      showBackButton
      backTo={AppRoutes.signIn}
      backButtonLabel={t("_accessibility:buttons.back")}
      headerExtra={
        <div className={`mb-3 p-0.5 rounded-xl w-full real-${color}`} />
      }
      emailLabel={t("_entities:user.email.label")}
      passwordLabel={t("_entities:user.password.label")}
      confirmPasswordLabel={t("_entities:user.rPassword.label")}
      emailRequiredMessage={t("_entities:user.email.required")}
      passwordRequiredMessage={t("_entities:user.password.required")}
      passwordMismatchMessage={t("_accessibility:errors.differentPasswords")}
      submitLabel={t("_pages:auth.signUp.submit")}
      submitAriaLabel={t("_accessibility:buttons.submit")}
      signInQuestion={t("_pages:auth.signUp.toLogin.question")}
      signInLabel={t("_pages:auth.signUp.toLogin.link")}
      signInTo={AppRoutes.signIn}
      guestLabel={t("_pages:auth.signUp.guest")}
      guestAriaLabel={t("_pages:auth.signUp.guest")}
      onSubmit={async (values) => {
        const signUpEmail = values.email.trim();
        await manager.Auth.register({
          email: values.email,
          password: values.password,
        } as RegisterDto);

        const locationState: SignUpSuccessLocationState | null =
          signUpEmail.length > 0 ? { email: signUpEmail } : null;

        if (locationState) {
          navigate(AppRoutes.signUpSuccess, { state: locationState });
          return;
        }

        navigate(AppRoutes.signUpSuccess);
      }}
      onStartAsGuest={() => {
        setGuestMode(true);
        navigate(AppRoutes.home);
      }}
      onPasswordMismatch={() =>
        showErrorNotification({
          message: t("_accessibility:errors.differentPasswords"),
        })
      }
      onError={(error) => {
        const message = isHttpError(error)
          ? getAuthErrorMessage(t, error.status, "signUp")
          : getAuthErrorMessage(t);

        showErrorNotification({ message });
      }}
    />
  );
}
