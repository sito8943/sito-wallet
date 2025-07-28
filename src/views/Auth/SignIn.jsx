import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// components
import Logo from "../../components/Logo/Logo";
import Loading from "../../partials/loading/Loading";
import TextInput from "../../components/Forms/TextInput";
import PasswordInput from "../../components/Forms/PasswordInput";

// providers
import { useAccount } from "../../providers/AccountProvider";
import { useNotification } from "../../providers/NotificationProvider";
import { useHotelApiClient } from "../../providers/HotelApiProvider";

/**
 * Sign Page
 * @returns Sign component
 */
function SignIn() {
  const { t } = useTranslation();

  const { logUser } = useAccount();

  const [appear, setAppear] = useState(false);

  const hotelApiClient = useHotelApiClient();

  const [userError, setUserError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [saving, setSaving] = useState(false);

  const { handleSubmit, control } = useForm();

  const { setNotification } = useNotification();

  const onSubmit = async (d) => {
    setUserError("");
    setPasswordError("");
    setSaving(true);
    try {
      const result = await hotelApiClient.User.login(d.email, d.password);
      const data = await result.json();
      // set server status to notification
      if (data.status) {
        if (data.status === 404)
          setUserError(t(`_accessibility:messages.404`, { model: t("_entities:entities.user") }));
        else if (data.status === 401 || data.status === 400)
          setPasswordError(t("_accessibility:messages.401"));
        else {
          const request = await hotelApiClient.User.fetchOwner(data.user.id);
          const hotelUser = await request.json();
          if (hotelUser) logUser({ ...data, hotelUser });
          else logUser({ ...data });
        }
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
    <div className="w-full h-screen flex items-start justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-96 max-sm:w-10/12 px-5 pt-10 flex flex-col items-center justify-start"
      >
        <Logo
          extra={false}
          className={`my-5 transition-all duration-500 ease-in-out delay-100  ${appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"}`}
        />
        <h1
          className={`w-full text-2xl md:text-3xl mb-5 transition-all duration-500 ease-in-out delay-200 ${appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"}`}
        >
          {t("_pages:auth.signIn.title")}
        </h1>
        <div
          className={`w-full transition-all duration-500 ease-in-out delay-300 ${appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"}`}
        >
          <Controller
            control={control}
            disabled={saving}
            name="email"
            render={({ field }) => (
              <TextInput
                {...field}
                type="text"
                name="email"
                id="email"
                className={`text-input peer`}
                label={t("_entities:user.email.label")}
                required
                helperText={userError}
                state={userError.length ? "error" : ""}
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
            name="password"
            render={({ field }) => (
              <PasswordInput
                {...field}
                name="password"
                id="password"
                className={`text-input peer`}
                label={t("_entities:user.password.label")}
                required
                helperText={passwordError}
                state={passwordError.length ? "error" : ""}
              />
            )}
          />
        </div>
        <div className="w-full mb-5">
          <Link
            to="/auth/recovery"
            className={`underline text-left transition-all duration-500 ease-in-out delay-[500ms] ${appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"}`}
          >
            {t("_pages:auth.signIn.passwordRecovery")}
          </Link>
        </div>
        <button
          type="submit"
          disabled={saving}
          className={`mb-5 self-start duration-500 ease-in-out delay-[600ms] ${appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"} submit`}
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

export default SignIn;
