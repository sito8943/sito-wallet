import { useCallback, useEffect, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import type { Option } from "@sito/dashboard-app";
import {
  Button,
  CheckInput,
  SelectInput,
  State,
  TextInput,
  useNotification,
} from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// hooks
import { ProfileQueryKeys } from "hooks";
import { useProfilePhoto } from "../hooks";

// components
import { ProfilePhoto } from "./ProfilePhoto";

// lib
import type { UpdateProfileDto } from "lib";

// types
import type { ProfileFormPropsType, ProfileFormType } from "../types";

// utils
import { getErrorMessage, normalizeProfileLanguage } from "../utils";
import SectionDivider from "../SectionDivider";

import "./styles.css";

export function ProfileForm({ profile }: ProfileFormPropsType) {
  const { t, i18n } = useTranslation();
  const manager = useManager();
  const { showErrorNotification, showSuccessNotification } = useNotification();

  const queryClient = useQueryClient();

  const handlePhotoUpdate = useCallback(() => {
    void queryClient.invalidateQueries({ ...ProfileQueryKeys.all() });
  }, [queryClient]);

  const { isUploading, uploadPhoto, deletePhoto } = useProfilePhoto(
    profile.id,
    handlePhotoUpdate,
  );

  const { control, formState, handleSubmit, reset } = useForm<ProfileFormType>({
    defaultValues: {
      name: "",
      language: "es",
      hideDeletedEntities: false,
    },
  });

  const updateProfile = useMutation<void, unknown, UpdateProfileDto>({
    mutationFn: async (data) => {
      await manager.Profiles.update(data);
    },
  });

  useEffect(() => {
    reset({
      name: profile.name ?? "",
      language: normalizeProfileLanguage(
        profile.language ?? i18n.resolvedLanguage ?? i18n.language,
      ),
      hideDeletedEntities: !!profile.hideDeletedEntities,
    });
  }, [i18n.language, i18n.resolvedLanguage, profile, reset]);

  const languageOptions = useMemo(
    () =>
      [
        {
          id: "en",
          name: t("_pages:profile.values.languageEnglish"),
        },
        {
          id: "es",
          name: t("_pages:profile.values.languageSpanish"),
        },
      ] as Option[],
    [t],
  );

  const currentName = useWatch({ control, name: "name" }) ?? "";
  const currentHideDeletedEntities = !!useWatch({
    control,
    name: "hideDeletedEntities",
  });
  const normalizedName = currentName.trim();
  const formDisabled = updateProfile.isPending;
  const saveDisabled =
    formDisabled ||
    !formState.isDirty ||
    !normalizedName.length ||
    normalizedName.length > 120;

  const onSubmit = handleSubmit(async (values) => {
    const payload: UpdateProfileDto = {
      id: profile.id,
      name: values.name.trim(),
      language: normalizeProfileLanguage(values.language),
      hideDeletedEntities: values.hideDeletedEntities,
    };

    try {
      await updateProfile.mutateAsync(payload);
      await queryClient.invalidateQueries({ ...ProfileQueryKeys.all() });
      const currentLanguage = normalizeProfileLanguage(
        i18n.resolvedLanguage ?? i18n.language,
      );
      if (payload.language && currentLanguage !== payload.language) {
        await i18n.changeLanguage(payload.language);
      }
      reset({
        name: payload.name ?? "",
        language: payload.language ?? "es",
        hideDeletedEntities: !!payload.hideDeletedEntities,
      });
      showSuccessNotification({
        message: t("_pages:profile.messages.updated"),
      });
    } catch (error) {
      showErrorNotification({
        message: getErrorMessage(error, t("_accessibility:errors.500")),
      });
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
        <section id="personal" className="profile-section-personal">
          <div className="profile-section-heading">
            <h3 className="profile-section-title">
              {t("_pages:profile.sections.personal")}
            </h3>
          </div>
          <div className="profile-personal-content">
            <div className="profile-personal-header">
              <div className="profile-personal-identity">
                <ProfilePhoto
                  profile={profile}
                  isUploading={isUploading}
                  onUpload={(file) => {
                    void uploadPhoto(file);
                  }}
                  onDelete={() => {
                    void deletePhoto();
                  }}
                />
                <div className="profile-personal-copy">
                  <h3 className="profile-personal-name">
                    {currentName || profile.name || ""}
                  </h3>
                  <p className="profile-personal-username">
                    {t("_pages:profile.labels.username")}:{" "}
                    {profile.user?.username ?? "-"}
                  </p>
                </div>
              </div>
            </div>

            <Controller
              control={control}
              name="name"
              disabled={formDisabled}
              rules={{
                validate: (value: string) => {
                  const parsedValue = value.trim();
                  if (!parsedValue.length) {
                    return t("_pages:profile.errors.nameRequired");
                  }
                  if (parsedValue.length > 120) {
                    return t("_pages:profile.errors.nameMax");
                  }
                  return true;
                },
              }}
              render={({ field, fieldState }) => (
                <TextInput
                  id="profile-name"
                  required
                  maxLength={120}
                  label={t("_entities:base.name.label")}
                  value={field.value ?? ""}
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
              name="language"
              disabled={formDisabled}
              render={({ field }) => (
                <SelectInput
                  id="profile-language"
                  required
                  label={t("_pages:profile.labels.language")}
                  options={languageOptions}
                  value={normalizeProfileLanguage(field.value)}
                  disabled={formDisabled}
                  helperText={t("_pages:profile.helper.language")}
                  onBlur={field.onBlur}
                  onChange={(event) =>
                    field.onChange(
                      normalizeProfileLanguage(
                        (event.target as HTMLSelectElement).value,
                      ),
                    )
                  }
                />
              )}
            />
          </div>
        </section>

        <SectionDivider />

        <section id="data" className="profile-section-data">
          <div className="profile-section-heading">
            <h3 className="profile-section-title">
              {t("_pages:profile.sections.data")}
            </h3>
            <p className="profile-section-helper">
              {t("_pages:profile.helper.hideDeletedEntities")}
            </p>
          </div>

          <div className="profile-toggle">
            <div className="profile-toggle-copy">
              <span id="hide-deleted-entities-label">
                {t("_pages:profile.labels.hideDeletedEntities")}
              </span>
              <span className="profile-toggle-hint">
                {currentHideDeletedEntities
                  ? t("_pages:profile.values.enabled")
                  : t("_pages:profile.values.disabled")}
              </span>
            </div>

            <Controller
              control={control}
              name="hideDeletedEntities"
              disabled={formDisabled}
              render={({ field }) => (
                <CheckInput
                  id="hide-deleted-entities"
                  name={field.name}
                  label=""
                  labelClassName="hidden"
                  containerClassName="shrink-0"
                  inputClassName="profile-toggle-input"
                  aria-labelledby="hide-deleted-entities-label"
                  checked={!!field.value}
                  disabled={formDisabled}
                  onBlur={field.onBlur}
                  onChange={(event) =>
                    field.onChange(event.currentTarget.checked)
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
            disabled={saveDisabled}
          >
            {t("_pages:profile.actions.save")}
          </Button>
        </div>
      </form>
    </div>
  );
}
