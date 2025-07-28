import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { createCookie } from "some-javascript-utils/browser";

// @sito/dashboard
import { TextInput } from "@sito/dashboard";

// components
import { Loading } from "components";

// providers
import { useNotification, useManager } from "providers";

// config
import { config } from "../../config";

/**
 * Recovery page
 * @returns Recovery page component
 */
function Recovery() {
  const { t } = useTranslation();

  const manager = useManager();

  const [appear, setAppear] = useState(false);
  const [saving, setSaving] = useState(false);

  const { handleSubmit, control } = useForm();

  const { setNotification } = useNotification();

  const onSubmit = async (d) => {
    setSaving(true);
    try {
      const response = await manager.User.recovery(d.email);
      const data = await response.json();
      if (data !== null && data.status && data.status !== 200)
        setNotification(String(data.status));
      else {
        setNotification(t("_pages:auth.recovery.sent"), {}, "good");
        createCookie(config.recovering, 1, d.email);
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
        <Link to="/auth">
          <Logo
            extra={false}
            className={`my-5 transition-all duration-500 ease-in-out delay-100  ${
              appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"
            }`}
          />
        </Link>
        <h1
          className={`w-full text-2xl md:text-3xl font-bold mb-5 transition-all duration-500 ease-in-out delay-200 ${
            appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"
          }`}
        >
          {t("_pages:auth.recovery.title")}
        </h1>
        <div
          className={`w-full transition-all duration-500 ease-in-out delay-300 ${
            appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"
          }`}
        >
          <Controller
            control={control}
            disabled={saving}
            name="email"
            render={({ field }) => (
              <TextInput
                {...field}
                type="email"
                name="email"
                id="email"
                className={`text-input peer`}
                label={t("_entities:user.email.label")}
                required
              />
            )}
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className={`mb-5 self-start duration-500 ease-in-out delay-[400ms] ${
            appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"
          } submit`}
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

export default Recovery;
