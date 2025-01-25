import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// providers
import { useAccount } from "../../providers/AccountProvider";
import { useAppApiClient } from "../../providers/AppApiProvider";

// components
import { SplashScreen } from "@sito/ui";

/**
 * SignOut page
 * @returns SignOut page component
 */
function SignOut() {
  const { t } = useTranslation();
  const { logoutUser } = useAccount();

  const appApiClient = useAppApiClient();

  const navigate = useNavigate();

  const logic = useCallback(async () => {
    await appApiClient.User.logout();
    logoutUser();
    setTimeout(() => {
      navigate("/auth");
    }, 1000);
  }, [appApiClient.User, logoutUser, navigate]);

  useEffect(() => {
    logic();
  }, [logic]);

  return (
    <SplashScreen
      visible
      logo={
        <div>
          <h1 className="uppercase">{t("_accessibility:appName")}</h1>
        </div>
      }
    />
  );
}

export default SignOut;
