import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import {
  Button,
  PasswordInput,
  State,
  useAuth,
  useNotification,
} from "@sito/dashboard-app";

import { useFeatureFlags, useManager } from "providers";

import {
  AppRoutes,
  clearAllTableOptions,
  clearPersistedPublicSessionAccount,
  type ChangePasswordDto,
} from "lib";

import type { ChangePasswordFormType } from "../types";
import SectionDivider from "../SectionDivider";
import { getChangePasswordErrorMessage } from "../utils";

export function ChangePasswordForm() {
  const { t } = useTranslation();
  const manager = useManager();
  const navigate = useNavigate();
  const { logoutUser } = useAuth();
  const { clearFeatures } = useFeatureFlags();
  const { showErrorNotification, showSuccessNotification } = useNotification();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { control, formState, handleSubmit, reset, setError } =
    useForm<ChangePasswordFormType>({
      defaultValues: {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
    });

  const changePassword = useMutation<void, unknown, ChangePasswordDto>({
    mutationFn: async (data) => {
      await manager.AuthApi.changePassword(data);
    },
  });

  const formDisabled = changePassword.isPending || isLoggingOut;

  const onSubmit = handleSubmit(async (values) => {
    const currentPassword = values.currentPassword;
    const newPassword = values.newPassword;
    const confirmPassword = values.confirmPassword;

    if (newPassword !== confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: t("_accessibility:errors.differentPasswords"),
      });
      showErrorNotification({
        message: t("_accessibility:errors.differentPasswords"),
      });
      return;
    }

    try {
      await changePassword.mutateAsync({
        currentPassword,
        newPassword,
      });

      setIsLoggingOut(true);
      showSuccessNotification({
        message: t("_pages:profile.messages.passwordUpdated"),
      });
      reset();
      clearPersistedPublicSessionAccount();
      clearAllTableOptions();
      clearFeatures();
      await logoutUser();
      navigate(AppRoutes.signIn);
    } catch (error) {
      showErrorNotification({
        message: getChangePasswordErrorMessage(error, t),
      });
    } finally {
      setIsLoggingOut(false);
    }
  });

  return (
    <div className="profile-form-shell base-border">
      <form
        className="profile-form"
        onSubmit={(event) => {
          event.preventDefault();
          void onSubmit(event);
        }}
      >
        <section id="security" className="profile-section-security">
          <div className="profile-section-heading">
            <h3 className="profile-section-title">
              {t("_pages:profile.sections.security")}
            </h3>
            <p className="profile-section-helper">
              {t("_pages:profile.helper.changePassword")}
            </p>
          </div>

          <div className="profile-password-fields">
            <Controller
              control={control}
              name="currentPassword"
              disabled={formDisabled}
              rules={{
                required: t("_pages:profile.errors.currentPasswordRequired"),
              }}
              render={({ field, fieldState }) => (
                <PasswordInput
                  id="profile-current-password"
                  required
                  label={t("_pages:profile.labels.currentPassword")}
                  value={field.value ?? ""}
                  autoComplete="current-password"
                  helperText={
                    typeof fieldState.error?.message === "string"
                      ? fieldState.error.message
                      : ""
                  }
                  state={fieldState.error ? State.error : State.default}
                  disabled={formDisabled}
                  onBlur={field.onBlur}
                  onChange={(event) =>
                    field.onChange((event.target as HTMLInputElement).value)
                  }
                />
              )}
            />

            <Controller
              control={control}
              name="newPassword"
              disabled={formDisabled}
              rules={{
                required: t("_pages:profile.errors.newPasswordRequired"),
              }}
              render={({ field, fieldState }) => (
                <PasswordInput
                  id="profile-new-password"
                  required
                  label={t("_entities:user.password.label")}
                  value={field.value ?? ""}
                  autoComplete="new-password"
                  helperText={
                    typeof fieldState.error?.message === "string"
                      ? fieldState.error.message
                      : ""
                  }
                  state={fieldState.error ? State.error : State.default}
                  disabled={formDisabled}
                  onBlur={field.onBlur}
                  onChange={(event) =>
                    field.onChange((event.target as HTMLInputElement).value)
                  }
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              disabled={formDisabled}
              rules={{
                required: t("_pages:profile.errors.confirmPasswordRequired"),
              }}
              render={({ field, fieldState }) => (
                <PasswordInput
                  id="profile-confirm-password"
                  required
                  label={t("_entities:user.rPassword.label")}
                  value={field.value ?? ""}
                  autoComplete="new-password"
                  helperText={
                    typeof fieldState.error?.message === "string"
                      ? fieldState.error.message
                      : ""
                  }
                  state={fieldState.error ? State.error : State.default}
                  disabled={formDisabled}
                  onBlur={field.onBlur}
                  onChange={(event) =>
                    field.onChange((event.target as HTMLInputElement).value)
                  }
                />
              )}
            />
          </div>
        </section>

        <SectionDivider />

        <div className="profile-actions">
          <Button
            type="submit"
            variant="submit"
            color="primary"
            className="profile-save-button"
            disabled={formDisabled || !formState.isDirty}
          >
            {t("_pages:profile.actions.changePassword")}
          </Button>
        </div>
      </form>
    </div>
  );
}
