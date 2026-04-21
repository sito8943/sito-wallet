import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import "./styles.css";

// @sito/dashboard-app
import {
  Button,
  Loading,
  PasswordInput,
  State,
  isHttpError,
  useNotification,
} from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// lib
import { AppRoutes } from "lib";

import type { UpdatePasswordFormType } from "./types";
import {
  extractRecoveryAccessTokenFromLocation,
  getTranslatedStatusMessage,
} from "./utils";

/**
 * UpdatePassword page
 * @returns UpdatePassword page component
 */
export function UpdatePassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const manager = useManager();
  const { showErrorNotification, showSuccessNotification } = useNotification();

  const [appear, setAppear] = useState(false);
  const [saving, setSaving] = useState(false);

  const { handleSubmit, control, setError } = useForm<UpdatePasswordFormType>({
    defaultValues: {
      password: "",
      rPassword: "",
    },
  });

  const accessToken = useMemo(
    () =>
      extractRecoveryAccessTokenFromLocation(
        window.location.hash,
        window.location.search,
      ),
    [],
  );

  const onSubmit = async (data: UpdatePasswordFormType) => {
    if (data.password !== data.rPassword) {
      setError("rPassword", {
        type: "validate",
        message: t("_accessibility:errors.differentPasswords"),
      });
      return;
    }

    if (!accessToken) {
      showErrorNotification({
        message: t("_pages:auth.updatePassword.invalidToken"),
      });
      return;
    }

    setSaving(true);
    try {
      await manager.AuthApi.resetPassword({
        accessToken,
        newPassword: data.password,
      });
      showSuccessNotification({
        message: t("_pages:auth.updatePassword.sent"),
      });

      setTimeout(() => {
        navigate(AppRoutes.signIn);
      }, 1200);
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
      setSaving(false);
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
        onSubmit={handleSubmit(onSubmit)}
        className={`${appear ? "blur-appear" : ""} auth-form`}
      >
        <h1
          className={`w-full text-2xl md:text-3xl mb-1 transition-all duration-500 ease-in-out delay-200 ${
            appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"
          }`}
        >
          {t("_pages:auth.updatePassword.title")}
        </h1>

        <div className="form-container w-full">
          <div
            className={`w-full transition-all duration-500 ease-in-out delay-300 ${
              appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"
            }`}
          >
            <Controller
              control={control}
              disabled={saving}
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
              disabled={saving}
              name="rPassword"
              render={({ field, fieldState }) => (
                <PasswordInput
                  {...field}
                  id="rPassword"
                  value={field.value ?? ""}
                  inputClassName="peer"
                  label={t("_entities:user.rPassword.label")}
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
          className={`self-start transition-all duration-500 ease-in-out delay-[500ms] ${
            appear ? "translate-y-0 opacity-100" : "opacity-0 translate-y-1"
          }`}
        >
          <p className="ml-1">
            {t("_pages:auth.updatePassword.toLogin.question")}
            <Link
              to={AppRoutes.signIn}
              className={`ml-1 primary text-sm underline text-left`}
            >
              {t("_pages:auth.updatePassword.toLogin.link")}
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
            disabled={saving}
            className="!px-8"
            aria-label={t("_pages:auth.updatePassword.submit")}
          >
            {saving && (
              <Loading
                className="!w-auto"
                color="stroke-base"
                loaderClass="!w-6"
                strokeWidth="6"
              />
            )}
            {t("_pages:auth.updatePassword.submit")}
          </Button>
        </div>
      </form>
    </div>
  );
}
