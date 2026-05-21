import { useTranslation } from "react-i18next";

import { AuthConfirmEmailSuccessView } from "@sito/dashboard-app";

import { TextLogo } from "components";
import { AppRoutes, randomBackgroundColor } from "lib";
import { useManager } from "providers";

const color: "primary" | "secondary" | "tertiary" | "quaternary" =
  randomBackgroundColor();

export function ConfirmEmailSuccess() {
  const { t } = useTranslation();
  const manager = useManager();

  return (
    <AuthConfirmEmailSuccessView
      authApi={manager.AuthApi}
      logo={<TextLogo variant={color} />}
      title={t("_pages:auth.confirmEmailSuccess.title")}
      showBackButton
      backTo={AppRoutes.signIn}
      backButtonLabel={t("_accessibility:buttons.back")}
      description={t("_pages:auth.confirmEmailSuccess.description")}
      toSignInLabel={t("_pages:auth.confirmEmailSuccess.toSignIn")}
      toSignInAriaLabel={t("_pages:auth.confirmEmailSuccess.toSignIn")}
      signInTo={AppRoutes.signIn}
      errorTo={AppRoutes.confirmEmailError}
      successTo={AppRoutes.confirmEmailSuccess}
    />
  );
}
