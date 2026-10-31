import { Suspense } from "react";

// components
import { SplashScreen, UpdateDialog } from "components";

// hooks
import { useAppSession } from "./hooks/useAppSession";
import { useSeo } from "./hooks/useSeo";

// routes
import { Routes } from "./Routes";

function App() {
  const loading = useAppSession();
  useSeo();

  // The splash stays mounted over the app and fades out once the session
  // is resolved, instead of being swapped out abruptly.
  return (
    <>
      <SplashScreen visible={loading} />
      {!loading && (
        <Suspense fallback={<SplashScreen />}>
          <Routes />
          <UpdateDialog />
        </Suspense>
      )}
    </>
  );
}

export default App;
