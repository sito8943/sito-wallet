import { Outlet, useNavigate, useLocation, Link, To } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { ErrorBoundary } from "react-error-boundary";
import { ComponentType, useEffect, useState } from "react";

// @sito/dashboard-app
import {
  BaseLinkPropsType,
  ConfigProvider,
  Error,
  Notification,
  ToTop,
  Onboarding,
  TableOptionsProvider,
} from "@sito/dashboard-app";

// providers
import { useAuth, fromLocal, toLocal } from "@sito/dashboard-app";

// components
import { SearchModal } from "components";
import Header from "./Header";
import Footer from "./Footer";

// config
import { config } from "../../config";

const steps = [
  "welcome",
  "currencies",
  "accounts",
  "transactions",
  "get_started",
];

export function View() {
  const { account, isInGuestMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const onboarding = fromLocal(config.onboarding);

    if (!onboarding) {
      setShowOnboarding(true);
      toLocal(config.onboarding, true);
    }
    if (!account.email && !isInGuestMode() && onboarding)
      navigate("/auth/sign-in");
  }, [account.email, isInGuestMode, navigate]);

  return (
    <ConfigProvider
      navigate={(route) => navigate(route as To)}
      location={location}
      linkComponent={Link as unknown as ComponentType<BaseLinkPropsType>}
      searchComponent={SearchModal}
    >
      {showOnboarding && <Onboarding steps={steps} />}
      <ToTop />
      <Header />
      <ErrorBoundary FallbackComponent={Error}>
        <TableOptionsProvider>
          <Outlet />
        </TableOptionsProvider>
      </ErrorBoundary>
      <Footer />
      <Notification />
      <Tooltip id="tooltip" />
    </ConfigProvider>
  );
}
