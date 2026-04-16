import { useCallback, useEffect, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import {
  Button,
  CheckInput,
  Option,
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
import { UpdateProfileDto } from "lib";

// types
import { ProfileFormPropsType, ProfileFormType } from "../types";

// utils
import { getErrorMessage, normalizeProfileLanguage } from "../utils";
import SectionDivider from "../SectionDivider";

export function ProfileForm({ profile }: ProfileFormPropsType) {
  const { t, i18n } = useTranslation();
  const manager = useManager();
  const { showErrorNotification, showSuccessNotification } = useNotification();

  const queryClient = useQueryClient();

  const handlePhotoUpdate = useCallback(() => {
    queryClient.invalidateQueries({ ...ProfileQueryKeys.all() });
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
    <div className="w-full max-w-2xl self-center base-border sm:p-6 p-2 rounded-2xl flex flex-col gap-6">
      <form
        className="flex flex-col gap-6"
        onSubmit={(event) => {
          event.preventDefault();
          void onSubmit(event);
        }}
      >
        <section id="personal" className="flex flex-col gap-1">
          <div className="flex flex-col gap-1">
            <h3 className="text-xs uppercase tracking-wide text-text-muted">
              {t("_pages:profile.sections.personal")}
            </h3>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex max-sm:flex-col max-sm:items-start items-center gap-4">
              <div className="flex items-center justify-start gap-4">
                <ProfilePhoto
                  profile={profile}
                  isUploading={isUploading}
                  onUpload={uploadPhoto}
                  onDelete={deletePhoto}
                />
                <div className="flex flex-col">
                  <h3 className="text-xl">{currentName || profile.name || ""}</h3>
                  <p className="text-sm text-text-muted">
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

        <section id="data" className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-xs uppercase tracking-wide text-text-muted">
              {t("_pages:profile.sections.data")}
            </h3>
            <p className="text-sm text-text-muted">
              {t("_pages:profile.helper.hideDeletedEntities")}
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-base-light p-3">
            <div className="flex flex-col gap-1">
              <span id="hide-deleted-entities-label">
                {t("_pages:profile.labels.hideDeletedEntities")}
              </span>
              <span className="text-sm text-text-muted">
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
                  inputClassName="h-4 w-4 accent-bg-primary"
                  aria-labelledby="hide-deleted-entities-label"
                  checked={!!field.value}
                  disabled={formDisabled}
                  onBlur={field.onBlur}
                  onChange={(event) => field.onChange(event.currentTarget.checked)}
                />
              )}
            />
          </div>
        </section>

        <SectionDivider />

        <div className="flex">
          <Button
            type="submit"
            variant="submit"
            color="primary"
            className="max-sm:w-full"
            disabled={saveDisabled}
          >
            {t("_pages:profile.actions.save")}
          </Button>
        </div>
      </form>
    </div>
  );
}
