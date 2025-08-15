import { Suspense, useEffect, useState } from "react";
import loadable from "@loadable/component";

// lib
import { fromLocal, toLocal } from "lib";

// config
import { config } from "./config";

// components
import { SplashScreen } from "components";

// providers
import { useAuth } from "providers";
import { Routes } from "./Routes";

// components
const Onboarding = loadable(() =>
  import("components").then((module) => ({
    default: module.Onboarding,
  }))
);

function App() {
  const { logUserFromLocal } = useAuth();
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    logUserFromLocal().then(() => setTimeout(() => setLoading(false), 300));
  }, [logUserFromLocal]);

  useEffect(() => {
    const onboarding = fromLocal(config.onboarding);
    if (!onboarding) {
      setShowOnboarding(true);
      toLocal(config.onboarding, true);
    }
  }, []);

  return (
    <Suspense fallback={<SplashScreen />}>
      {showOnboarding && <Onboarding />}
      {!loading && <Routes />}
    </Suspense>
  );
}

export default App;
