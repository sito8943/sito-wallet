import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { deleteCookie } from "some-javascript-utils/browser";

// components
import Logo from "../../components/Logo/Logo";
import Loading from "../../partials/loading/Loading";
import PasswordInput from "../../components/Forms/PasswordInput";

// providers
import { useNotification } from "../../providers/NotificationProvider";
import { useHotelApiClient } from "../../providers/HotelApiProvider";

// config
import config from "../../config";

/**
 * UpdatePassword page
 * @returns UpdatePassword page component
 */
function UpdatePassword() {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const hotelApiClient = useHotelApiClient();

  const [appear, setAppear] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [saving, setSaving] = useState(false);

  const { handleSubmit, control } = useForm();

  const { setNotification } = useNotification();

  const onSubmit = async (d) => {
    setSaving(true);
    setPasswordError("");
    if (d.password !== d.rPassword) {
      setSaving(false);
      // eslint-disable-next-line no-console
      console.error(t("_accessibility:errors.passwordDoNotMatch"));
      return setNotification(t("_accessibility:errors.passwordDoNotMatch"));
    }
    try {
      await hotelApiClient.User.updatePassword(d.password);
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
  };

  useEffect(() => {
    setTimeout(() => {
      setAppear(true);
    }, 1100);
  }, []);

  return (
    <div className="w-full h-screen flex items-start justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-96 max-sm:w-10/12 px-5 pt-10 flex flex-col items-center justify-start"
      >
        <Link to="/auth">
          <Logo
            extra={false}
            className={`my-5 transition-all duration-500 ease-in-out delay-100  ${appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"}`}
          />
        </Link>
        <h1
          className={`w-full text-2xl md:text-3xl font-bold mb-5 transition-all duration-500 ease-in-out delay-200 ${appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"}`}
        >
          {t("_pages:auth.updatePassword.title")}
        </h1>
        <div
          className={`w-full transition-all duration-500 ease-in-out delay-300 ${appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"}`}
        >
          <Controller
            control={control}
            disabled={saving}
            name="password"
            render={({ field }) => (
              <PasswordInput
                {...field}
                name="password"
                id="password"
                className={`text-input peer`}
                label={t("_entities:user.password.label")}
                required
              />
            )}
          />
        </div>
        <div
          className={`w-full transition-all duration-500 ease-in-out delay-[400ms] ${appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"}`}
        >
          <Controller
            control={control}
            disabled={saving}
            name="rPassword"
            render={({ field }) => (
              <PasswordInput
                {...field}
                name="rPassword"
                id="rPassword"
                className={`text-input peer`}
                label={t("_entities:user.rPassword.label")}
                required
                helperText={passwordError}
                state={passwordError.length ? "error" : ""}
              />
            )}
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className={`mb-5 self-start duration-500 ease-in-out delay-[500ms] ${appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"} submit`}
        >
          {saving && (
            <Loading
              className="button-loading"
              strokeWidth="4"
              loaderClass="!w-6"
              color="stroke-white"
            />
          )}
          {t("_accessibility:buttons.submit")}
        </button>
      </form>
    </div>
  );
}

export default UpdatePassword;
