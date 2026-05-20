import { useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

import {
  AuthFormShell,
  Button,
  Loading,
  isHttpError,
  useAuth,
  useMutationForm,
  useNotification,
  type AuthFormFieldDefinitionType,
  type SessionDto,
} from "@sito/dashboard-app";

import { TextLogo } from "components";
import { AppRoutes, randomBackgroundColor } from "lib";
import { useManager } from "providers";

import "./styles.css";
import type { SignInFormType } from "./types";
import { getAuthErrorMessage } from "./getAuthErrorMessage";

const color: "primary" | "secondary" | "tertiary" | "quaternary" =
  randomBackgroundColor();

/**
 * Sign Page
 * @returns Sign component
 */
export function SignIn() {
  const { t } = useTranslation();
  const { logUser, setGuestMode } = useAuth();
  const { showErrorNotification } = useNotification();
  const manager = useManager();
  const navigate = useNavigate();
  const rememberMeRef = useRef(false);

  const { handleSubmit, control, onSubmit, isLoading } = useMutationForm<
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
      const message = isHttpError(error)
        ? getAuthErrorMessage(t, error.status, "signIn")
        : getAuthErrorMessage(t);

      showErrorNotification({ message });
    },
  });

  const fields = useMemo<AuthFormFieldDefinitionType<SignInFormType>[]>(
    () => [
      {
        kind: "text",
        name: "email",
        id: "email",
        type: "email",
        label: t("_entities:user.email.label"),
        required: true,
        rules: { required: `${t("_entities:user.email.required")}` },
      },
      {
        kind: "password",
        name: "password",
        id: "password",
        label: t("_entities:user.password.label"),
        required: true,
        rules: { required: `${t("_entities:user.password.required")}` },
      },
      {
        kind: "checkbox",
        name: "rememberMe",
        id: "rememberMe",
        label: t("_pages:auth.signIn.remember"),
        containerClassName: "ml-1",
      },
    ],
    [t],
  );

  const helperLinks = (
    <>
      <p className="auth-form-helper-text">
        {t("_pages:auth.signIn.toRegister.question")}
        <Link to={AppRoutes.signUp} className="auth-form-helper-link">
          {t("_pages:auth.signIn.toRegister.link")}
        </Link>
      </p>
      <p className="auth-form-helper-text">
        {t("_pages:auth.signIn.accountRecovery.question")}
        <Link to={AppRoutes.recovery} className="auth-form-helper-link">
          {t("_pages:auth.signIn.accountRecovery.link")}
        </Link>
      </p>
    </>
  );

  const actions = (
    <>
      <Button
        type="submit"
        color="primary"
        variant="submit"
        className="auth-submit-button"
        disabled={isLoading}
        aria-label={t("_accessibility:buttons.submit")}
      >
        {isLoading && (
          <Loading
            color="stroke-base"
            loaderClass="auth-loading-icon"
            className="auth-loading"
            strokeWidth="6"
          />
        )}
        {t("_pages:auth.signIn.submit")}
      </Button>
      <Button
        type="button"
        variant="outlined"
        disabled={isLoading}
        onClick={() => {
          setGuestMode(true);
          navigate(AppRoutes.home);
        }}
        aria-label={t("_pages:auth.signIn.guest")}
      >
        {t("_pages:auth.signIn.guest")}
      </Button>
    </>
  );

  return (
    <AuthFormShell
      title={t("_pages:auth.signIn.title")}
      logo={<TextLogo variant={color} />}
      control={control}
      fields={fields}
      disabled={isLoading}
      onSubmit={(event) => {
        void handleSubmit(onSubmit)(event);
      }}
      helperLinks={helperLinks}
      actions={actions}
    />
  );
}
