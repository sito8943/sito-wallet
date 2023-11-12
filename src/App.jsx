import { Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// layouts
import Auth from "./layouts/Auth";
import View from "./layouts/View/View";

// @sito/ui
import { Handler, Loading, Notification, useNotification } from "@sito/ui";

// services
import { validateUser } from "./services/auth";

// context
import { useUser } from "./providers/UserProvider";

// views
import SignIn from "./views/Auth/SignIn";
import SignOut from "./views/Auth/SignOut";
import SignUp from "./views/Auth/SignUp";
import Home from "./views/Home/Home";
import NotFound from "./views/NotFound/NotFound";

function App() {
  const { userState, setUserState } = useUser();
  const { setNotificationState } = useNotification();

  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    const { data, error } = await validateUser();
    if (error && error !== null)
      setNotificationState({ type: "error", message: error.message });
    else setUserState({ type: "logged-in", user: data.user });
    setLoading(false);
  };

  useEffect(() => {
    fetch();
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
              {userState.user ? (
                <Route path="/" element={<View />}>
                  <Route index element={<Home />} />
                </Route>
              ) : (
                <></>
              )}

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
