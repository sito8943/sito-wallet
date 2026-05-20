import { useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

import type { RegisterDto, SessionDto } from "@sito/dashboard-app";
import {
  AuthFormShell,
  Button,
  Loading,
  isHttpError,
  useAuth,
  useMutationForm,
  useNotification,
  type AuthFormFieldDefinitionType,
} from "@sito/dashboard-app";

import { AppRoutes, randomBackgroundColor } from "lib";
import { useManager } from "providers";

import "./styles.css";
import type { SignUpFormType, SignUpSuccessLocationState } from "./types";
import { getAuthErrorMessage } from "./getAuthErrorMessage";

const color: "primary" | "secondary" | "tertiary" | "quaternary" =
  randomBackgroundColor();

/**
 * Sign Page
 * @returns Sign component
 */
export function SignUp() {
  const { t } = useTranslation();
  const { setGuestMode } = useAuth();
  const { showErrorNotification } = useNotification();
  const manager = useManager();
  const navigate = useNavigate();
  const signUpEmailRef = useRef("");

  const { handleSubmit, control, onSubmit, isLoading } = useMutationForm<
    SignUpFormType,
    SignUpFormType,
    SessionDto,
    SignUpFormType
  >({
    queryKey: ["auth", "sign-up"],
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    formToDto: (data: SignUpFormType) => {
      if (data.password !== data.confirmPassword) {
        showErrorNotification({
          message: t("_accessibility:errors.differentPasswords"),
        });
        throw Error("differentPasswords");
      }
      return data;
    },
    mutationFn: async (data: SignUpFormType) => {
      signUpEmailRef.current = data.email.trim();
      return await manager.Auth.register({
        email: data.email,
        password: data.password,
      } as RegisterDto);
    },
    onSuccess: () => {
      const locationState: SignUpSuccessLocationState | null =
        signUpEmailRef.current.length > 0
          ? { email: signUpEmailRef.current }
          : null;

      if (locationState) {
        navigate(AppRoutes.signUpSuccess, { state: locationState });
        return;
      }

      navigate(AppRoutes.signUpSuccess);
    },
    onError: (error) => {
      const message = isHttpError(error)
        ? getAuthErrorMessage(t, error.status, "signUp")
        : getAuthErrorMessage(t);

      showErrorNotification({ message });
    },
  });

  const fields = useMemo<AuthFormFieldDefinitionType<SignUpFormType>[]>(
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
        kind: "password",
        name: "confirmPassword",
        id: "confirmPassword",
        label: t("_entities:user.rPassword.label"),
      },
    ],
    [t],
  );

  const helperLinks = (
    <p className="auth-form-helper-text">
      {t("_pages:auth.signUp.toLogin.question")}
      <Link to={AppRoutes.signIn} className="auth-form-helper-link">
        {t("_pages:auth.signUp.toLogin.link")}
      </Link>
    </p>
  );

  const actions = (
    <>
      <Button
        type="submit"
        color="primary"
        variant="submit"
        disabled={isLoading}
        className="auth-submit-button"
        aria-label={t("_accessibility:buttons.submit")}
      >
        {isLoading && (
          <Loading
            className="auth-loading"
            color="stroke-base"
            loaderClass="auth-loading-icon"
            strokeWidth="6"
          />
        )}
        {t("_pages:auth.signUp.submit")}
      </Button>
      <Button
        type="button"
        variant="outlined"
        disabled={isLoading}
        onClick={() => {
          setGuestMode(true);
          navigate(AppRoutes.home);
        }}
        aria-label={t("_pages:auth.signUp.guest")}
      >
        {t("_pages:auth.signUp.guest")}
      </Button>
    </>
  );

  return (
    <AuthFormShell
      title={t("_pages:auth.signUp.title")}
      titleClassName="w-full text-2xl md:text-3xl mb-1"
      headerExtra={
        <div className={`mb-3 p-0.5 rounded-xl w-full real-${color}`} />
      }
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
