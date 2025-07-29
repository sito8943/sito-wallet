import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// providers
import { useAuth } from "providers";

// components
import { SplashScreen } from "components";

/**
 * SignOut page
 * @returns SignOut page component
 */
export function SignOut() {
  const { logoutUser } = useAuth();

  const navigate = useNavigate();

  const logic = useCallback(async () => {
    logoutUser();
    setTimeout(() => {
      navigate("/auth/sign-in");
    }, 1000);
  }, [logoutUser, navigate]);

  useEffect(() => {
    logic();
  }, [logic]);

  return <SplashScreen />;
}
