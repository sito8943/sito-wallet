import { Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import loadable from "@loadable/component";

// layouts
import Auth from "./layouts/Auth";
import View from "./layouts/View/View";

// @sito/ui
import { Handler, Loading, Notification } from "@sito/ui";

// services
import { validateUser } from "./services/auth";

// context
import { useUser } from "./providers/UserProvider";

// auth cache
import { cachedUser, getUser, logoutUser, saveUser } from "./utils/auth";

// views
const SignIn = loadable(() => import("./views/Auth/SignIn"));
const SignOut = loadable(() => import("./views/Auth/SignOut"));
const SignUp = loadable(() => import("./views/Auth/SignUp"));
const Home = loadable(() => import("./views/Home/Home"));
const NotFound = loadable(() => import("./views/NotFound/NotFound"));
const Settings = loadable(() => import("./views/Settings/Settings"));

function App() {
  const { setUserState } = useUser();

  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    try {
      const { data, error } = await validateUser();
      if (error && error !== null && cachedUser())
        setUserState({ type: "logged-in", user: getUser(), cached: true });
      else {
        saveUser({ ...getUser(), user: data.user, cached: false });
        setUserState({ type: "logged-in", user: data.user });
      }
    } catch (err) {
      logoutUser();
      console.error(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Suspense>
      <Handler>
        <Notification />
        {!loading ? (
          <BrowserRouter>
            <Routes>
              <Route exact path="/auth" element={<Auth />}>
                <Route index element={<SignIn />} />
                <Route path="/auth/sign-up" element={<SignUp />} />
              </Route>
              <Route path="/" element={<View />}>
                <Route index element={<Home />} />
                <Route path="/settings" element={<Settings />} />
              </Route>

              <Route exact path="/sign-out" element={<SignOut />} />
              <Route path="/*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        ) : (
          <Loading className="w-full h-screen fixed top-0 left-0 z-40" />
        )}
      </Handler>
    </Suspense>
  );
}

export default App;
