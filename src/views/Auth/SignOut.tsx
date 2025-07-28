import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// providers
import { useAuth, useManager } from "providers";

// components
import { SplashScreen } from "components";

/**
 * SignOut page
 * @returns SignOut page component
 */
export function SignOut() {
  const manager = useManager();
  const { logoutUser } = useAuth();

  const navigate = useNavigate();

  const logic = useCallback(async () => {
    await manager.Auth.logout();
    logoutUser();
    setTimeout(() => {
      navigate("/auth");
    }, 1000);
  }, [logoutUser, manager.Auth, navigate]);

  useEffect(() => {
    logic();
  }, [logic]);

  return <SplashScreen />;
}
