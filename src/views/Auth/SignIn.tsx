import { useEffect, useRef, useState } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

// styles
import "./styles.css";

// @sito/dashboard-app
import {
  useNotification,
  useAuth,
  usePostForm,
  SessionDto,
  PasswordInput,
  Loading,
  Button,
  State,
  TextInput,
  isHttpError,
} from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// lib
import { AppRoutes, randomBackgroundColor } from "lib";

// components
import { TextLogo } from "components";
import type { SignInFormType } from "./types";

const color: "primary" | "secondary" | "tertiary" | "quaternary" =
  randomBackgroundColor();

/**
 * Sign Page
 * @returns Sign component
 */
export function SignIn() {
  const { t } = useTranslation();

  const { logUser } = useAuth();

  const [appear, setAppear] = useState(false);

  const { setGuestMode } = useAuth();

  const { showErrorNotification } = useNotification();

  const manager = useManager();
  const navigate = useNavigate();

  const rememberMeRef = useRef(false);

  const { handleSubmit, control, onSubmit, isLoading } = usePostForm<
    SignInFormType,
    SignInFormType,
    SessionDto,
    SignInFormType
  >({
    queryKey: ["auth", "sign-in"],
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    formToDto: (data: SignInFormType) => data,
    mutationFn: async (data: SignInFormType) => {
      rememberMeRef.current = data.rememberMe;
      return await manager.Auth.login(data);
    },
    onSuccess: (data) => {
      logUser(data, rememberMeRef.current);
      setGuestMode(false);
      navigate(AppRoutes.home);
    },
    onError: (error) => {
      if (isHttpError(error))
        showErrorNotification({
          message: t(`_accessibility:errors.signIn.${error.status}`),
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
        <div
          className={`mb-5 flex flex-col gap-10 justify-start items-start w-full transition-all duration-500 ease-in-out delay-200 ${
            appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"
          }`}
        >
          <TextLogo variant={color} />
          <h1 className={`w-full text-2xl mb-1`}>
            {t("_pages:auth.signIn.title")}
          </h1>
        </div>

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
                  id="email"
                  value={field.value ?? ""}
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
                  inputClassName="peer"
                  label={t("_entities:user.password.label")}
                  value={field.value ?? ""}
                  required
                  helperText={fieldState.error?.message}
                  state={fieldState.error ? State.error : State.default}
                />
              )}
              rules={{ required: `${t("_entities:user.password.required")}` }}
            />
          </div>
        </div>
        <div
          className={`self-start mt-1 transition-all duration-500 ease-in-out delay-[450ms] ${
            appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"
          }`}
        >
          <Controller
            control={control}
            disabled={isLoading}
            name="rememberMe"
            render={({ field }) => (
              <label
                htmlFor="rememberMe"
                className="ml-1 flex items-center gap-2"
              >
                <input
                  id="rememberMe"
                  type="checkbox"
                  name={field.name}
                  checked={!!field.value}
                  onBlur={field.onBlur}
                  onChange={(event) => field.onChange(event.target.checked)}
                />
                <span className="text-sm">
                  {t("_pages:auth.signIn.remember")}
                </span>
              </label>
            )}
          />
        </div>
        <div
          className={`self-start transition-all duration-500 ease-in-out delay-[500ms] ${
            appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"
          }`}
        >
          <p className="ml-1">
            {t("_pages:auth.signIn.toRegister.question")}
            <Link
              to={AppRoutes.signUp}
              className={`ml-1 primary text-sm underline text-left`}
            >
              {t("_pages:auth.signIn.toRegister.link")}
            </Link>
          </p>
        </div>
        <div
          className={`self-start transition-all duration-500 ease-in-out delay-[600ms] ${
            appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"
          }`}
        >
          <p className="ml-1">
            {t("_pages:auth.signIn.accountRecovery.question")}
            <Link
              to={AppRoutes.recovery}
              className={`ml-1 primary text-sm underline text-left`}
            >
              {t("_pages:auth.signIn.accountRecovery.link")}
            </Link>
          </p>
        </div>
        <div
          className={`flex max-xs:flex-col gap-3 mt-4 w-full duration-500 ease-in-out delay-[700ms] ${
            appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"
          }`}
        >
          <Button
            type="submit"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            color={color as any}
            variant="submit"
            className="!px-8"
            disabled={isLoading}
            aria-label={t("_accessibility:buttons.submit")}
          >
            {isLoading && (
              <Loading
                color="stroke-base"
                loaderClass="!w-6"
                className="!w-auto"
                strokeWidth="6"
              />
            )}
            {t("_pages:auth.signIn.submit")}
          </Button>
          <Button
            type="button"
            variant="outlined"
            onClick={() => {
              setGuestMode(true);
              navigate(AppRoutes.home);
            }}
            aria-label={t("_pages:auth.signIn.guest")}
          >
            {t("_pages:auth.signIn.guest")}
          </Button>
        </div>
      </form>
    </div>
  );
}
