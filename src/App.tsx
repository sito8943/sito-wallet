import { Suspense, useEffect, useState } from "react";

// components
import { SplashScreen } from "components";

// providers
import { useAuth } from "providers";
import { Routes } from "./Routes";

function App() {
  const { logUserFromLocal } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    logUserFromLocal().then(() => setTimeout(() => setLoading(false), 300));
  }, [logUserFromLocal]);

  return (
    <Suspense fallback={<SplashScreen />}>{!loading && <Routes />}</Suspense>
  );
}

export default App;
