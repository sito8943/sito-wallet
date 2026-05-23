import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import {
  AuthSignInView,
  isHttpError,
  useAuth,
  useNotification,
} from "@sito/dashboard-app";

import { TextLogo } from "components";
import { AppRoutes, randomBackgroundColor } from "lib";
import { useManager } from "providers";

import "./styles.css";
import { getAuthErrorMessage } from "./getAuthErrorMessage";

const color: "primary" | "secondary" | "tertiary" | "quaternary" =
  randomBackgroundColor();

/**
 * Sign Page
 * @returns Sign component
 */
export function SignIn() {
  const { t } = useTranslation();
  const { logUser } = useAuth();
  const { showErrorNotification } = useNotification();
  const manager = useManager();
  const navigate = useNavigate();

  return (
    <AuthSignInView
      title={t("_pages:auth.signIn.title")}
      logo={<TextLogo variant={color} />}
      emailLabel={t("_entities:user.email.label")}
      passwordLabel={t("_entities:user.password.label")}
      rememberLabel={t("_pages:auth.signIn.remember")}
      emailRequiredMessage={t("_entities:user.email.required")}
      passwordRequiredMessage={t("_entities:user.password.required")}
      submitLabel={t("_pages:auth.signIn.submit")}
      submitAriaLabel={t("_accessibility:buttons.submit")}
      signUpQuestion={t("_pages:auth.signIn.toRegister.question")}
      signUpLabel={t("_pages:auth.signIn.toRegister.link")}
      signUpTo={AppRoutes.signUp}
      recoveryQuestion={t("_pages:auth.signIn.accountRecovery.question")}
      recoveryLabel={t("_pages:auth.signIn.accountRecovery.link")}
      recoveryTo={AppRoutes.recovery}
      onSubmit={async (values) => {
        console.log("Submitting sign in form with values:", values);
        const session = await manager.Auth.login(values);
        logUser(session, values.rememberMe);
        navigate(AppRoutes.home);
      }}
      onError={(error) => {
        const message = isHttpError(error)
          ? getAuthErrorMessage(t, error.status, "signIn")
          : getAuthErrorMessage(t);

        showErrorNotification({ message });
      }}
    />
  );
}
