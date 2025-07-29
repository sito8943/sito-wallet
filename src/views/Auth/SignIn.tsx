import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// @sito/dashboard
import { State, TextInput, Loading } from "@sito/dashboard";

// components
import { PasswordInput } from "components";

// providers
import { useAuth, useManager, useNotification } from "providers";

// hooks
import { usePostForm } from "hooks";

// lib
import { AuthDto, SessionDto } from "lib";

/**
 * Sign Page
 * @returns Sign component
 */
export function SignIn() {
  const { t } = useTranslation();

  const { logUser } = useAuth();

  const [appear, setAppear] = useState(false);

  const { showErrorNotification } = useNotification();

  const manager = useManager();

  const { handleSubmit, control, onSubmit, isLoading } = usePostForm<
    AuthDto,
    AuthDto,
    SessionDto,
    AuthDto
  >({
    formToDto: (data: AuthDto) => data,
    mutationFn: async (data: AuthDto) => await manager.Auth.login(data),
    onSuccess: (data) => {
      logUser(data);
    },
    onError: (errors) => {
      console.log(errors);
      showErrorNotification({
        message: t(`_accessibility:errors.${errors.message}`),
      });
    },
  });

  useEffect(() => {
    setTimeout(() => {
      setAppear(true);
    }, 1100);
  }, []);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-base rounded-3xl w-96 max-sm:w-10/12 px-5 py-10 flex flex-col items-center justify-start"
      >
        {/* LOGO */}
        <h1
          className={`w-full text-2xl md:text-3xl mb-10 transition-all duration-500 ease-in-out delay-200 ${
            appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"
          }`}
        >
          {t("_pages:auth.signIn.title")}
        </h1>
        <div className="flex flex-col gap-5 w-full">
          <div
            className={`w-full transition-all duration-500 ease-in-out delay-300 ${
              appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"
            }`}
          >
            <Controller
              control={control}
              disabled={isLoading}
              name="email"
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  type="text"
                  name="email"
                  id="email"
                  className={`text-input peer`}
                  label={t("_entities:user.email.label")}
                  required
                  helperText={fieldState.error?.message}
                  state={fieldState.error ? State.error : State.default}
                />
              )}
              rules={{ required: `${t("_entities:user.email.required")}` }}
            />
          </div>
          <div
            className={`w-full transition-all duration-500 ease-in-out delay-[400ms] ${
              appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"
            }`}
          >
            <Controller
              control={control}
              disabled={isLoading}
              name="password"
              render={({ field, fieldState }) => (
                <PasswordInput
                  {...field}
                  name="password"
                  id="password"
                  className={`text-input peer`}
                  label={t("_entities:user.password.label")}
                  required
                  helperText={fieldState.error?.message}
                  state={fieldState.error ? State.error : State.default}
                />
              )}
              rules={{ required: `${t("_entities:user.password.required")}` }}
            />
          </div>
        </div>
        <div className="w-full mb-5">
          <Link
            to="/auth/recovery"
            className={`underline text-left transition-all duration-500 ease-in-out delay-[500ms] ${
              appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"
            }`}
          >
            {t("_pages:auth.signIn.passwordRecovery")}
          </Link>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`self-start duration-500 ease-in-out delay-[600ms] ${
            appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"
          } submit`}
        >
          {isLoading && (
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
