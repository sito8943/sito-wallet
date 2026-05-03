import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "./styles.css";

// @sito/dashboard-app
import {
  Button,
  Loading,
  State,
  TextInput,
  isHttpError,
  useNotification,
} from "@sito/dashboard-app";

// lib
import { AppRoutes } from "lib";

// providers
import { useManager } from "providers";

import type { RecoveryFormType } from "./types";
import { buildAuthRedirectUrl, getTranslatedStatusMessage } from "./utils";

/**
 * Recovery page
 * @returns Recovery page component
 */
export function Recovery() {
  const { t } = useTranslation();
  const manager = useManager();
  const { showErrorNotification, showSuccessNotification } = useNotification();

  const [appear, setAppear] = useState(false);
  const [loadingAction, setLoadingAction] = useState<
    "forgot" | "resend-confirm" | null
  >(null);

  const { handleSubmit, control, trigger, getValues } = useForm<RecoveryFormType>(
    {
      defaultValues: {
        email: "",
      },
    },
  );

  const isLoading = loadingAction !== null;

  const forgotRedirectTo = buildAuthRedirectUrl(AppRoutes.resetPassword);
  const confirmRedirectTo = buildAuthRedirectUrl(AppRoutes.confirmEmailSuccess);

  const onForgotPassword = async ({ email }: RecoveryFormType) => {
    setLoadingAction("forgot");
    try {
      const response = await manager.AuthApi.forgotPassword({
        email,
        redirectTo: forgotRedirectTo,
      });
      showSuccessNotification({
        message: response.message || t("_pages:auth.recovery.sent"),
      });
    } catch (error) {
      if (isHttpError(error)) {
        const translatedStatusMessage = getTranslatedStatusMessage(
          t,
          "_accessibility:errors",
          error.status,
        );

        showErrorNotification({
          message:
            translatedStatusMessage ??
            error.message ??
            t("_accessibility:errors.500"),
        });
      } else {
        showErrorNotification({ message: t("_accessibility:errors.500") });
      }
    } finally {
      setLoadingAction(null);
    }
  };

  const onResendConfirmEmail = async () => {
    const isValid = await trigger("email");
    if (!isValid) return;

    setLoadingAction("resend-confirm");
    try {
      const response = await manager.AuthApi.resendConfirmEmail({
        email: getValues("email"),
        redirectTo: confirmRedirectTo,
      });
      showSuccessNotification({
        message:
          response.message || t("_pages:auth.recovery.confirmationSent"),
      });
    } catch (error) {
      if (isHttpError(error)) {
        const translatedStatusMessage = getTranslatedStatusMessage(
          t,
          "_accessibility:errors",
          error.status,
        );

        showErrorNotification({
          message:
            translatedStatusMessage ??
            error.message ??
            t("_accessibility:errors.500"),
        });
      } else {
        showErrorNotification({ message: t("_accessibility:errors.500") });
      }
    } finally {
      setLoadingAction(null);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setAppear(true);
    }, 500);
  }, []);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onForgotPassword)}
        className={`${appear ? "blur-appear" : ""} auth-form`}
      >
        <h1
          className={`w-full text-2xl md:text-3xl mb-1 transition-all duration-500 ease-in-out delay-200 ${
            appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"
          }`}
        >
          {t("_pages:auth.recovery.title")}
        </h1>

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
        </div>

        <div
          className={`self-start transition-all duration-500 ease-in-out delay-[500ms] ${
            appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"
          }`}
        >
          <p className="ml-1">
            {t("_pages:auth.recovery.toLogin.question")}
            <Link
              to={AppRoutes.signIn}
              className={`ml-1 primary text-sm underline text-left`}
            >
              {t("_pages:auth.recovery.toLogin.link")}
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
            variant="submit"
            color="primary"
            className="!px-8"
            disabled={isLoading}
            aria-label={t("_pages:auth.recovery.submit")}
          >
            {loadingAction === "forgot" && (
              <Loading
                className="!w-auto"
                color="stroke-base"
                loaderClass="!w-6"
                strokeWidth="6"
              />
            )}
            {t("_pages:auth.recovery.submit")}
          </Button>
          <Button
            type="button"
            variant="outlined"
            className="!px-8"
            disabled={isLoading}
            onClick={onResendConfirmEmail}
            aria-label={t("_pages:auth.recovery.resendConfirm")}
          >
            {loadingAction === "resend-confirm" && (
              <Loading
                className="!w-auto"
                color="stroke-primary"
                loaderClass="!w-6"
                strokeWidth="6"
              />
            )}
            {t("_pages:auth.recovery.resendConfirm")}
          </Button>
        </div>
      </form>
    </div>
  );
}
