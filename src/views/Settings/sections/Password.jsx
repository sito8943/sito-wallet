import { useState } from "react";
import { useTranslation } from "react-i18next";
import { faLock, faLockOpen } from "@fortawesome/free-solid-svg-icons";

// @sito/ui
import {
  useNotification,
  Loading,
  InputControl,
  IconButton,
  Button,
} from "@sito/ui";

// services
import { updatePassword } from "../../../services/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Password() {
  const { t } = useTranslation();

  const { setNotification } = useNotification();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordHelperText, setPasswordHelperText] = useState("");

  const handlePassword = (e) => setPassword(e.target.value);

  const toggleShowPassword = () => setShowPassword((oldValue) => !oldValue);

  const [rPassword, setRPassword] = useState("");
  const [showRPassword, setShowRPassword] = useState(false);

  const handleRPassword = (e) => setRPassword(e.target.value);

  const toggleShowRPassword = () => setShowRPassword((oldValue) => !oldValue);

  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setPasswordHelperText("");
    if (!password.length) {
      document.getElementById("password")?.focus();
      setPasswordHelperText(t("_accessibility:inputs.password.requiredError"));
      return;
    }
    if (password !== rPassword) {
      document.getElementById("password")?.focus();
      setPasswordHelperText(
        t("_accessibility:inputs.password.passwordNoMatch")
      );
      return;
    }
    setLoading(true);
    const { error } = await updatePassword(password);
    if (error && error !== null)
      setNotification({ type: "error", message: error.message });
    else {
      setPassword("");
      setRPassword("");
    }
    setLoading(false);
  };

  return (
    <section className="flex flex-col gap-3 ">
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-3 justify-start items-start"
      >
        <h3 className="text-xl">
          {t("_pages:settings.sections.security.title")}
        </h3>
        <InputControl
          id="password"
          className="w-full"
          label={t("_accessibility:inputs.password.label")}
          maxLength={25}
          value={password}
          onChange={handlePassword}
          disabled={loading}
          type={!showPassword ? "password" : "string"}
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
        <InputControl
          id="rPassword"
          className="w-full"
          label={t("_accessibility:inputs.rPassword")}
          maxLength={25}
          value={rPassword}
          onChange={handleRPassword}
          disabled={loading}
          type={!showRPassword ? "password" : "string"}
          leftComponent={
            <IconButton
              tabIndex={-1}
              name="toggle-see-r-password"
              onClick={toggleShowRPassword}
              icon={
                <FontAwesomeIcon icon={showRPassword ? faLockOpen : faLock} />
              }
              className="-ml-3"
              aria-label={`${t(
                `_accessibility:inputs.password.${
                  showRPassword ? "showPassword" : "hidePassword"
                }`
              )}`}
            />
          }
        />
        <Button
          name="save-password"
          aria-label={`${t("_accessibility:buttons.save")} ${t(
            "_accessibility:inputs.password.label"
          )}`}
          type="submit"
          shape="filled"
          className="button-loading"
          disabled={loading}
        >
          {loading ? (
            <Loading color="basics" strokeWidth="8" />
          ) : (
            t("_accessibility:buttons.save")
          )}
        </Button>
      </form>
    </section>
  );
}

export default Password;
