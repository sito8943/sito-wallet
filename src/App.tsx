import { Suspense, useEffect, useRef, useState } from "react";

// components
import { useAuth, SplashScreen } from "@sito/dashboard-app";

// providers
import { Routes } from "./Routes";

function App() {
  const { logUserFromLocal } = useAuth();
  const [loading, setLoading] = useState(true);
  const hasInitializedSession = useRef(false);

  useEffect(() => {
    if (hasInitializedSession.current) return;

    hasInitializedSession.current = true;
    logUserFromLocal().then(() => setTimeout(() => setLoading(false), 300));
  }, [logUserFromLocal]);

  return (
    <Suspense fallback={<SplashScreen />}>{!loading && <Routes />}</Suspense>
  );
}

export default App;
