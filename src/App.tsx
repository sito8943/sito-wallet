import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, useEffect, useState } from "react";
import loadable from "@loadable/component";

// lib
import { fromLocal, toLocal } from "lib";

// config
import { config } from "./config";

// layouts
import { View, Auth } from "./layouts";

// components
import { SplashScreen } from "components";

// providers
import { useAuth } from "providers";
import { Onboarding } from "./components/Onboarding/Onboarding";

// auth
const SignUp = loadable(() =>
  import("views").then((module) => ({
    default: module.SignUp,
  }))
);
const SignIn = loadable(() =>
  import("views").then((module) => ({
    default: module.SignIn,
  }))
);
const SignOut = loadable(() =>
  import("views").then((module) => ({
    default: module.SignOut,
  }))
);
const UpdatePassword = loadable(() =>
  import("views").then((module) => ({
    default: module.UpdatePassword,
  }))
);
const Recovery = loadable(() =>
  import("views").then((module) => ({
    default: module.Recovery,
  }))
);
// view
const Home = loadable(() =>
  import("views").then((module) => ({
    default: module.Home,
  }))
);
const NotFound = loadable(() =>
  import("views").then((module) => ({
    default: module.NotFound,
  }))
);
const TransactionCategories = loadable(() =>
  import("views").then((module) => ({ default: module.TransactionCategories }))
);
const Transactions = loadable(() =>
  import("views").then((module) => ({
    default: module.Transactions,
  }))
);
const Accounts = loadable(() =>
  import("views").then((module) => ({
    default: module.Accounts,
  }))
);
const Currencies = loadable(() =>
  import("views").then((module) => ({
    default: module.Currencies,
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
      {!loading && (
        <BrowserRouter>
          <Routes>
            <Route path="/auth/" element={<Auth />}>
              <Route path="/auth/sign-in" element={<SignIn />} />
              <Route path="/auth/sign-up" element={<SignUp />} />
              <Route
                path="/auth/update-password"
                element={<UpdatePassword />}
              />
              <Route path="/auth/recovery" element={<Recovery />} />
              <Route path="/auth/*" element={<NotFound />} />
            </Route>
            <Route path="/sign-out" element={<SignOut />} />
            <Route path="/" element={<View />}>
              <Route index element={<Home />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route
                path="/transaction-categories"
                element={<TransactionCategories />}
              />
              <Route path="/accounts" element={<Accounts />} />
              <Route path="/currencies" element={<Currencies />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      )}
    </Suspense>
  );
}

export default App;
