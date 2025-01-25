import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { deleteCookie } from "some-javascript-utils/browser";
import { css } from "@emotion/css";

// @sito/ui
import {
  useNotification,
  Loading,
  InputControl,
  IconButton,
  Button,
} from "@sito/ui";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faLockOpen } from "@fortawesome/free-solid-svg-icons";

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
 * UpdatePassword page
 * @returns UpdatePassword page component
 */
function UpdatePassword() {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const appApiClient = useAppApiClient();

  const { setNotification } = useNotification();

  const [appear, setAppear] = useState(false);

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordHelperText, setPasswordHelperText] = useState("");

  const handlePassword = (e) => setPassword(e.target.value);

  const toggleShowPassword = () => setShowPassword((oldValue) => !oldValue);

  const [rPassword, setRPassword] = useState("");
  const [showRPassword, setRShowPassword] = useState(false);

  const handleRPassword = (e) => setRPassword(e.target.value);

  const toggleRShowPassword = () => setRShowPassword((oldValue) => !oldValue);

  const [saving, setSaving] = useState(false);

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setSaving(true);
      setPasswordHelperText("");

      if (!password.length) {
        document.getElementById("password")?.focus();
        setPasswordHelperText(t("_accessibility:errors.passwordRequired"));
        setSaving(false);
        return;
      }
      if (password !== rPassword) {
        setSaving(false);
        // eslint-disable-next-line no-console
        console.error(t("_accessibility:errors.passwordDoNotMatch"));
        return setNotification(t("_accessibility:errors.passwordDoNotMatch"));
      }
      try {
        await appApiClient.User.updatePassword(password);
        setNotification(t("_pages:auth.updatePassword.sent"), {}, "good");

        deleteCookie(config.recovering);
        setTimeout(() => navigate("/sign-out"), 2000);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        // set server status to notification
        setNotification(String(e.status));
      }
      setSaving(false);
    },
    [appApiClient.User, navigate, password, rPassword, setNotification, t]
  );

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
            {t("_pages:auth.updatePassword.title")}
          </h2>
        </Link>

        <div
          className={`${transition} !delay-300 ${
            appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"
          }`}
        >
          <InputControl
            id="password"
            className={`sign-in-input`}
            value={password}
            onChange={handlePassword}
            type={!showPassword ? "password" : "text"}
            label={t("_accessibility:inputs.password.label")}
            leftComponent={
              <IconButton
                tabIndex={-1}
                name="toggle-see-password"
                onClick={toggleShowPassword}
                icon={
                  <FontAwesomeIcon icon={showPassword ? faLockOpen : faLock} />
                }
                className="-ml-3"
                aria-label={`${t(
                  `_accessibility:inputs.password.${
                    showPassword ? "showPassword" : "hidePassword"
                  }`
                )}`}
              />
            }
            helperText={passwordHelperText}
          />
        </div>
        <div
          className={`${transition} !delay-300 ${
            appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"
          }`}
        >
          <InputControl
            id="password"
            className={`sign-in-input`}
            value={password}
            onChange={handleRPassword}
            type={!showPassword ? "password" : "text"}
            label={t("_accessibility:inputs.rPassword")}
            leftComponent={
              <IconButton
                tabIndex={-1}
                name="toggle-see-password"
                onClick={toggleRShowPassword}
                icon={
                  <FontAwesomeIcon icon={showRPassword ? faLockOpen : faLock} />
                }
                className="-ml-3"
                aria-label={`${t(
                  `_accessibility:inputs.rPassword.${
                    showRPassword ? "showPassword" : "hidePassword"
                  }`
                )}`}
              />
            }
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

export default UpdatePassword;
