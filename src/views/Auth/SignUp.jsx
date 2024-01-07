import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// @sito/ui
import {
  useNotification,
  InputControl,
  IconButton,
  Button,
  Loading,
} from "@sito/ui";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faLockOpen,
} from "@fortawesome/free-solid-svg-icons";

// contexts
import { useUser } from "../../providers/UserProvider";

// components
import ModeButton from "../../components/ModeButton/ModeButton";

// services
import { register } from "../../services/auth";
import { createSettingsUser } from "../../services/user";

// auth
import { saveUser } from "../../utils/auth";

// images
// import logo from "../../assets/images/logo.png";

// lang
import { showError } from "../../lang/es";

// styles
import "./styles.css";

function SignUp() {
  const { t } = useTranslation();

  const { setNotification } = useNotification();

  const [email, setEmail] = useState("");
  const [emailHelperText, setEmailHelperText] = useState("");

  const handleEmail = (e) => setEmail(e.target.value);

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [passwordHelperText, setPasswordHelperText] = useState("");

  const handlePassword = (e) => setPassword(e.target.value);

  const toggleShowPassword = () => setShowPassword((oldValue) => !oldValue);

  const [rPassword, setRPassword] = useState("");
  const [showRPassword, setShowRPassword] = useState(false);

  const handleRPassword = (e) => setRPassword(e.target.value);

  const toggleShowRPassword = () => setShowRPassword((oldValue) => !oldValue);

  const navigate = useNavigate();

  const { setUserState } = useUser();

  const [loading, setLoading] = useState(false);
  const [goToVerify, setGoToVerify] = useState(false);

  const onSubmit = useCallback(
    async (e) => {
      setEmailHelperText("");
      setPasswordHelperText("");
      e.preventDefault();
      if (!email.length) {
        document.getElementById("email")?.focus();
        setEmailHelperText(t("_accessibility:errors.emailRequired"));
        return;
      }
      if (!password.length) {
        document.getElementById("password")?.focus();
        setPasswordHelperText(t("_accessibility:errors.passwordRequired"));
        return;
      }
      if (password !== rPassword) {
        document.getElementById("password")?.focus();
        setPasswordHelperText(t("_accessibility:errors.passwordsDoNotMatch"));
        return;
      }
      setLoading(true);
      const response = await register(email, password);
      const { data, error } = response;
      if (!error || error === null) {
        const settingUser = await createSettingsUser(data.user.id);
        if (settingUser.error && settingUser.user !== null) {
          console.error(settingUser.error.message);
          setGoToVerify(true);
        } else {
          setUserState({
            type: "logged-in",
            user: {
              ...data.user,
            },
            photo: {},
          });
          saveUser({ user: data.user, photo: {} });
          navigate("/");
        }
      } else
        setNotification({ type: "error", message: showError(error.message) });
      setLoading(false);
    },
    [email, password, rPassword, setNotification, t, setUserState, navigate]
  );

  return (
    <main className="w-full viewport flex items-center justify-center">
      <ModeButton color="primary" className="top-1 right-1" />
      <div
        className={`bg-light-dark dark:bg-dark-dark fixed top-0 left-0 z-10 w-full h-screen flex items-center backdrop-blur-[1rem] transition-all duration-100 ${
          loading ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <Loading
          className={`bg-light-default dark:bg-dark-default transition-all duration-300  ${
            loading ? "!h-[100px]" : "!h-[0px]"
          }`}
        />
      </div>
      {goToVerify ? (
        <div className="form bg-light-dark dark:bg-dark-dark appear items-center">
          <h1 className="text-success text-center text-4xl">
            {t("_pages:signUp.titleThanksFor")}
          </h1>
          <p className="text-center">{t("_pages:signUp.thanksFor")}</p>
          <Link
            to="/auth"
            name="sign-in"
            aria-label={t("_pages:routes.signIn")}
            className="filled primary button"
          >
            {t("_pages:routes.signIn")}
          </Link>
        </div>
      ) : (
        <form
          onSubmit={onSubmit}
          className="form bg-light-dark dark:bg-dark-dark appear"
        >
          <div className="flex gap-2 items-start flex-col">
            {/* <img src={logo} alt="stick notes logo" className="w-10 h-10" /> */}
            LOGO
            <h1 className="primary uppercase text-4xl">
              {t("_accessibility:appName")}
            </h1>
          </div>
          <InputControl
            id="email"
            label={t("_accessibility:inputs.email.label")}
            className="sign-in-input"
            value={email}
            onChange={handleEmail}
            type="email"
            leftComponent={
              <div className="icon-button button -ml-3">
                <FontAwesomeIcon className="primary" icon={faEnvelope} />
              </div>
            }
            helperText={emailHelperText}
          />
          <InputControl
            id="password"
            className="sign-in-input"
            label={t("_accessibility:inputs.password.label")}
            maxLength={25}
            value={password}
            onChange={handlePassword}
            type={!showPassword ? "password" : "string"}
            leftComponent={
              <IconButton
                tabIndex={-1}
                name="toggle-see-password"
                onClick={toggleShowPassword}
                icon={showPassword ? faLockOpen : faLock}
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
          <InputControl
            id="rPassword"
            className="sign-in-input"
            label={t("_accessibility:inputs.rPassword")}
            maxLength={25}
            value={rPassword}
            onChange={handleRPassword}
            type={!showRPassword ? "password" : "string"}
            leftComponent={
              <IconButton
                tabIndex={-1}
                name="toggle-see-r-password"
                onClick={toggleShowRPassword}
                icon={showRPassword ? faLockOpen : faLock}
                className="-ml-3"
                aria-label={`${t(
                  `_accessibility:inputs.password.${
                    showPassword ? "showPassword" : "hidePassword"
                  }`
                )}`}
              />
            }
          />
          <p>
            {t("_pages:auth.toSignIn.label")}{" "}
            <Link to="/auth/sign-up" className="underline primary">
              {t("_pages:routes.signIn")}
            </Link>
          </p>
          <div className="w-full flex gap-5 justify-end items-center">
            <Button
              name="sign-up"
              type="submit"
              color="primary"
              shape="filled"
              aria-label={t("_pages:auth.signUp.nextAriaLabel")}
            >
              {t("_accessibility:buttons.next")}
            </Button>
          </div>
        </form>
      )}
    </main>
  );
}

export default SignUp;
