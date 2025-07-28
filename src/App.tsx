import { Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import loadable from "@loadable/component";
import { useTranslation } from "react-i18next";

// providers
import { useAccount } from "./providers/AccountProvider";

// layouts
import Auth from "./layouts/Auth";
import View from "./layouts/View/View";

// @sito/ui
import { Handler, SplashScreen, Notification } from "@sito/ui";

// views
const SignIn = loadable(() => import("./views/Auth/SignIn"));
const SignOut = loadable(() => import("./views/Auth/SignOut"));
const Home = loadable(() => import("./views/Home/Home"));
const NotFound = loadable(() => import("./views/NotFound/NotFound"));
const Settings = loadable(() => import("./views/Settings/Settings"));
const AllSpent = loadable(() => import("./views/AllSpent/AllSpent"));
const AllLogs = loadable(() => import("./views/AllLogs/AllLogs"));

function App() {
  const [loaded, setLoaded] = useState(true);
  const { t } = useTranslation();

  const { logUserFromLocal } = useAccount();

  useEffect(() => {
    const html = document.querySelector("html");
    if (html) {
      html.style.scrollBehavior = "auto";
      window.scroll({ top: 0 });
      html.style.scrollBehavior = "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]); // triggered on route change

  useEffect(() => {
    logUserFromLocal();
    setTimeout(() => {
      setLoaded(false);
    }, 1000);
  }, [logUserFromLocal]);

  return (
    <Suspense>
      <Handler>
        <Notification />
        <SplashScreen
          visible={loaded}
          logo={
            <div>
              <h1 className="uppercase">{t("_accessibility:appName")}</h1>
            </div>
          }
        />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />}>
              <Route index element={<SignIn />} />
            </Route>
            <Route path="/" element={<View />}>
              <Route index element={<Home />} />
              <Route path="/spent" element={<AllSpent />} />
              <Route path="/logs" element={<AllLogs />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            <Route path="/sign-out" element={<SignOut />} />
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </Handler>
    </Suspense>
  );
}

export default App;
