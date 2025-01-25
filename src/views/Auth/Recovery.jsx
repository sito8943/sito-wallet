import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { createCookie } from "some-javascript-utils/browser";
import { css } from "@emotion/css";

// @sito/ui
import { useNotification, Loading, InputControl, Button } from "@sito/ui";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

// providers
import { useAppApiClient } from "../../providers/AppApiProvider";

// config
import config from "../../config";

// styles
import "./styles.css";

const transition = css({
  transition: "opacity, transform",
  transitionDuration: "500ms",
  transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
});

/**
 * Recovery page
 * @returns Recovery page component
 */
function Recovery() {
  const { t } = useTranslation();

  const appApiClient = useAppApiClient();

  const [user, setUser] = useState("");
  const [userHelperText, setUserHelperText] = useState("");

  const handleUser = (e) => setUser(e.target.value);

  const [appear, setAppear] = useState(false);
  const [saving, setSaving] = useState(false);

  const { setNotification } = useNotification();

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setUserHelperText("");

    if (!user.length) {
      document.getElementById("user")?.focus();
      setUserHelperText(t("_accessibility:errors.emailRequired"));
      setSaving(false);
      return;
    }

    try {
      const response = await appApiClient.User.recovery(user);
      const data = await response.json();
      if (data !== null && data.status && data.status !== 200)
        setNotification(String(data.status));
      else {
        setNotification(t("_pages:auth.recovery.sent"), {}, "good");
        createCookie(config.recovering, 1, user);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      // set server status to notification
      setNotification(String(e.status));
    }
    setSaving(false);
  };

  useEffect(() => {
    setTimeout(() => {
      setAppear(true);
    }, 1100);
  }, []);

  return (
    <>
      <div
        className={`bg-light-dark dark:bg-dark-dark fixed top-0 left-0 z-10 w-full h-screen flex items-center backdrop-blur-[1rem] ${transition} duration-100 ${
          saving ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <Loading
          className={`bg-light-default dark:bg-dark-default ${transition} !duration-300 ${
            saving ? "!h-[100px]" : "!h-[0px]"
          }`}
        />
      </div>
      <form
        onSubmit={onSubmit}
        className="form bg-light-dark dark:bg-dark-dark appear"
      >
        <Link
          to="/auth"
          className={`flex gap-2 items-start flex-col ${transition} !delay-100 ${
            appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"
          }`}
        >
          <h2 className={`w-full text-2xl md:text-3xl font-bold`}>
            {t("_pages:auth.recovery.title")}
          </h2>
        </Link>

        <div
          className={`${transition} !delay-200 ${
            appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"
          }`}
        >
          <InputControl
            id="user"
            label={t("_accessibility:inputs.email.label")}
            className={`sign-in-input`}
            value={user}
            onChange={handleUser}
            leftComponent={
              <div className="icon-button button -ml-3">
                <FontAwesomeIcon className="primary" icon={faUser} />
              </div>
            }
            helperText={userHelperText}
          />
        </div>
        <div className="w-full flex gap-5 justify-end items-center">
          <Button
            name="login"
            type="submit"
            color="primary"
            shape="filled"
            aria-label={t("_pages:auth.signIn.signInAriaLabel")}
            className={`duration-500 ease-in-out delay-[500ms] ${
              appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"
            }`}
          >
            {t("_accessibility:buttons.submit")}
          </Button>
        </div>
      </form>
    </>
  );
}

export default Recovery;
