import { Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import loadable from "@loadable/component";
import { useTranslation } from "react-i18next";

// layouts
import Auth from "./layouts/Auth";
import View from "./layouts/View/View";

// @sito/ui
import { Handler, SplashScreen, Notification, useNotification } from "@sito/ui";

// services
import { refresh, validateUser } from "./services/auth";
import { fetchAccounts } from "./services/account";

// context
import { useUser } from "./providers/UserProvider";

// auth cache
import {
  cachedUser,
  getUser,
  logoutUser,
  remember,
  saveUser,
} from "./utils/auth";

// utils
import { toCamelCase } from "./utils/parsers";

// views
const SignIn = loadable(() => import("./views/Auth/SignIn"));
const SignOut = loadable(() => import("./views/Auth/SignOut"));
const Home = loadable(() => import("./views/Home/Home"));
const NotFound = loadable(() => import("./views/NotFound/NotFound"));
const Settings = loadable(() => import("./views/Settings/Settings"));
const AllSpent = loadable(() => import("./views/AllSpent/AllSpent"));
const AllLogs = loadable(() => import("./views/AllLogs/AllLogs"));

function App() {
  const { t } = useTranslation();

  const { setUserState } = useUser();
  const { setNotification } = useNotification();

  const [loading, setLoading] = useState(true);

  async function handleUserError(error) {
    if (error.message === "invalid claim: missing sub claim" && cachedUser()) {
      const rememberValue = remember();
      if (rememberValue !== null) {
        const response = await refresh(getUser().user.email, rememberValue);
        if (response.error) {
          handleResponseError(response.error);
          return;
        }
        await handleUserSuccess(response.data);
      } else {
        logoutUser();
      }
    } else if (cachedUser()) {
      setUserState({ type: "logged-in", user: getUser(), cached: true });
    } else {
      logoutUser();
    }
  }

  async function handleUserSuccess(data) {
    const account = await fetchAccounts({
      sort: ["updated_at"],
      user: data.user.id,
    });
    if (account.error && account.error !== null) {
      handleResponseError(account.error);
      return;
    }
    const lastAccount = account.data[0];
    saveUser({
      ...getUser(),
      user: data.user,
      account: lastAccount,
    });
    setUserState({
      type: "logged-in",
      user: data.user,
      account: lastAccount,
      cached: false,
    });
  }

  function handleResponseError(error) {
    logoutUser();
    setNotification({
      type: "error",
      message: t(`_accessibility:errors.${toCamelCase(error.message)}`),
    });
    setLoading(false);
  }

  async function fetch() {
    try {
      const { data, error } = await validateUser();
      if (error && error !== null) {
        await handleUserError(error);
      } else {
        await handleUserSuccess(data);
      }
    } catch (err) {
      logoutUser();
      console.error(err);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Suspense>
      <Handler>
        <Notification />
        <SplashScreen
          visible={loading}
          logo={
            <div>
              <h1 className="uppercase">{t("_accessibility:appName")}</h1>
            </div>
          }
        />
        {!loading ? (
          <BrowserRouter>
            <Routes>
              <Route exact path="/auth" element={<Auth />}>
                <Route index element={<SignIn />} />
              </Route>
              <Route path="/" element={<View />}>
                <Route index element={<Home />} />
                <Route path="/spent" element={<AllSpent />} />
                <Route path="/logs" element={<AllLogs />} />
                <Route path="/settings" element={<Settings />} />
              </Route>

              <Route exact path="/sign-out" element={<SignOut />} />
              <Route path="/*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        ) : null}
      </Handler>
    </Suspense>
  );
}

export default App;
