import { useTranslation } from "react-i18next";

import { AuthConfirmEmailErrorView } from "@sito/dashboard-app";

import { TextLogo } from "components";
import { AppRoutes, randomBackgroundColor } from "lib";

const color: "primary" | "secondary" | "tertiary" | "quaternary" =
  randomBackgroundColor();

export function ConfirmEmailError() {
  const { t } = useTranslation();

  return (
    <AuthConfirmEmailErrorView
      logo={<TextLogo variant={color} />}
      title={t("_pages:auth.confirmEmailError.title")}
      description={t("_pages:auth.confirmEmailError.description")}
      resendLabel={t("_pages:auth.confirmEmailError.resend")}
      resendAriaLabel={t("_pages:auth.confirmEmailError.resend")}
      toSignInLabel={t("_pages:auth.confirmEmailError.toSignIn")}
      toSignInAriaLabel={t("_pages:auth.confirmEmailError.toSignIn")}
      resendTo={AppRoutes.recovery}
      signInTo={AppRoutes.signIn}
    />
  );
}
