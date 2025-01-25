import { useEffect } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { getCookie } from "some-javascript-utils/browser";

// @sito/ui
import { Notification } from "@sito/ui";

// providers
import { useAccount } from "../providers/AccountProvider";

// components
import ModeButton from "../components/ModeButton/ModeButton";

import config from "../config";

/**
 * Auth layout
 * @returns Auth component
 */
function Auth() {
  const navigate = useNavigate();

  const { account } = useAccount();

  useEffect(() => {
    const recovering = getCookie(config.recovering);
    if (recovering?.length) navigate("/auth/update-password");
    else {
      if (account.user) navigate("/");
    }
  }, [account, navigate]);

  return (
    <main className="w-full viewport flex items-center justify-center overflow-hidden">
      <Notification />
      <Link to="/auth">
        <h1 className="absolute top-3 left-3 primary uppercase text-4xl">
          Sito Notas
        </h1>
      </Link>
      <ModeButton color="primary" className="top-3 right-3" />
      <Outlet />
    </main>
  );
}

export default Auth;
