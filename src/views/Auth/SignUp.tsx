import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

// @sito/dashboard
import { State, TextInput } from "@sito/dashboard";

// components
import { PasswordInput, Loading } from "components";

// providers
import { useAuth, useManager, useNotification } from "providers";

// hooks
import { usePostForm } from "hooks";

// lib
import { RegisterDto, SessionDto } from "lib";

/**
 * Sign Page
 * @returns Sign component
 */
export function SignUp() {
  const { t } = useTranslation();

  const { logUser } = useAuth();

  const [appear, setAppear] = useState(false);

  const { showErrorNotification } = useNotification();

  const manager = useManager();

  const navigate = useNavigate();

  const { handleSubmit, control, onSubmit, isLoading } = usePostForm<
    RegisterDto,
    RegisterDto,
    SessionDto,
    RegisterDto
  >({
    formToDto: (data: RegisterDto) => {
      if (data.password !== data.rPassword) {
        showErrorNotification({
          message: t("_accessibility:errors.differentPasswords"),
        });
        throw Error("differentPasswords");
      }
      return data;
    },
    mutationFn: async (data: RegisterDto) => await manager.Auth.register(data),
    onSuccess: (data) => {
      logUser(data);
      navigate("/");
    },
    onError: () => {
      showErrorNotification({
        message: t("_entities:user.email.unique"),
      });
    },
  });

  useEffect(() => {
    setTimeout(() => {
      setAppear(true);
    }, 500);
  }, []);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`${appear ? "bg-base" : ""} auth-form`}
      >
        {/* LOGO */}
        <h1
          className={`w-full text-2xl md:text-3xl mb-10 transition-all duration-500 ease-in-out delay-200 ${
            appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"
          }`}
        >
          {t("_pages:auth.signUp.title")}
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
                  type="email"
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
          <div
            className={`w-full transition-all duration-500 ease-in-out delay-[400ms] ${
              appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"
            }`}
          >
            <Controller
              control={control}
              disabled={isLoading}
              name="rPassword"
              render={({ field, fieldState }) => (
                <PasswordInput
                  {...field}
                  id="rPassword"
                  className={`text-input peer`}
                  label={t("_entities:user.rPassword.label")}
                  helperText={fieldState.error?.message}
                  state={fieldState.error ? State.error : State.default}
                />
              )}
            />
          </div>
        </div>
        <div
          className={`self-start transition-all duration-500 ease-in-out delay-[500ms] ${
            appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"
          }`}
        >
          <p className="ml-1">
            {t("_pages:auth.signUp.toLogin.question")}
            <Link
              to="/auth/sign-in"
              className={`ml-1 primary text-sm underline text-left`}
            >
              {t("_pages:auth.signUp.toLogin.link")}
            </Link>
          </p>
        </div>
        <div
          className={`flex gap-3 mt-6 w-full duration-500 ease-in-out delay-[600ms] ${
            appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"
          }`}
        >
          <button
            type="submit"
            disabled={isLoading}
            className={`button !px-8 primary submit`}
          >
            {isLoading && <Loading color="text-base" />}
            {t("_pages:auth.signUp.submit")}
          </button>
        </div>
      </form>
    </div>
  );
}
