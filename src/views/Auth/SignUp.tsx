import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

// styles
import "./styles.css";

// @sito/dashboard-app
import {
  State,
  TextInput,
  useNotification,
  useAuth,
  usePostForm,
  RegisterDto,
  SessionDto,
  Button,
  Loading,
  PasswordInput,
  isHttpError,
} from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// lib
import { AppRoutes, randomBackgroundColor } from "lib";

// types
import type { SignUpFormType } from "./types";

// utils
import { getTranslatedStatusMessage } from "./utils";

const color: "primary" | "secondary" | "tertiary" | "quaternary" =
  randomBackgroundColor();

/**
 * Sign Page
 * @returns Sign component
 */
export function SignUp() {
  const { t } = useTranslation();

  const { setGuestMode } = useAuth();

  const [appear, setAppear] = useState(false);

  const { showErrorNotification } = useNotification();

  const manager = useManager();

  const navigate = useNavigate();

  const { handleSubmit, control, onSubmit, isLoading } = usePostForm<
    SignUpFormType,
    SignUpFormType,
    SessionDto,
    SignUpFormType
  >({
    queryKey: ["auth", "sign-up"],
    defaultValues: {
      email: "",
      password: "",
      rPassword: "",
    },
    formToDto: (data: SignUpFormType) => {
      if (data.password !== data.rPassword) {
        showErrorNotification({
          message: t("_accessibility:errors.differentPasswords"),
        });
        throw Error("differentPasswords");
      }
      return data;
    },
    mutationFn: async (data: SignUpFormType) =>
      await manager.Auth.register(
        {
          email: data.email,
          password: data.password,
        } as RegisterDto,
      ),
    onSuccess: () => {
      navigate(AppRoutes.signUpSuccess);
    },
    onError: (error) => {
      if (isHttpError(error)) {
        const translatedStatusMessage = getTranslatedStatusMessage(
          t,
          "_accessibility:errors.signUp",
          error.status,
        );

        showErrorNotification({
          message:
            translatedStatusMessage ??
            error.message ??
            t("_accessibility:errors.500"),
        });
        return;
      }

      showErrorNotification({
        message: t("_accessibility:errors.500"),
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
        className={`${appear ? "blur-appear" : ""} auth-form`}
      >
        <h1
          className={`w-full text-2xl md:text-3xl mb-1 transition-all duration-500 ease-in-out delay-200 ${
            appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"
          }`}
        >
          {t("_pages:auth.signUp.title")}
        </h1>
        <div
          className={`mb-8 p-0.5 rounded-xl w-full real-${color} transition-all duration-500 ease-in-out delay-200 ${
            appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"
          }`}
        ></div>
        <div className="form-container w-full">
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
                  value={field.value ?? ""}
                  id="email"
                  inputClassName="peer"
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
                  value={field.value ?? ""}
                  inputClassName="peer"
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
                  value={field.value ?? ""}
                  id="rPassword"
                  inputClassName="peer"
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
              to={AppRoutes.signIn}
              className={`ml-1 primary text-sm underline text-left`}
            >
              {t("_pages:auth.signUp.toLogin.link")}
            </Link>
          </p>
        </div>
        <div
          className={`flex max-xs:flex-col gap-3 mt-6 w-full duration-500 ease-in-out delay-[600ms] ${
            appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"
          }`}
        >
          <Button
            type="submit"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            color={color as any}
            variant="submit"
            disabled={isLoading}
            className="!px-8"
            aria-label={t("_accessibility:buttons.submit")}
          >
            {isLoading && (
              <Loading
                className="!w-auto"
                color="stroke-base"
                loaderClass="!w-6"
                strokeWidth="6"
              />
            )}
            {t("_pages:auth.signUp.submit")}
          </Button>
          <Button
            type="button"
            variant="outlined"
            onClick={() => {
              setGuestMode(true);
              navigate(AppRoutes.home);
            }}
            aria-label={t("_pages:auth.signUp.guest")}
          >
            {t("_pages:auth.signUp.guest")}
          </Button>
        </div>
      </form>
    </div>
  );
}
