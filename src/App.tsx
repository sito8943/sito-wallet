import { Suspense } from "react";

// components
import { SplashScreen } from "@sito/dashboard-app";
import { UpdateDialog } from "components";

// hooks
import { useAppSession, useSeo } from "hooks";

// routes
import { Routes } from "./Routes";

function App() {
  const loading = useAppSession();
  useSeo();

  if (loading) return <SplashScreen />;

  return (
    <Suspense fallback={<SplashScreen />}>
      <Routes />
      <UpdateDialog />
    </Suspense>
  );
}

export default App;
