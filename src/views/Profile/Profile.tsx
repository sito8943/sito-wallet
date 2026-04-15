import { useCallback, useEffect, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import {
  Button,
  CheckInput,
  Error as ErrorView,
  Loading,
  Option,
  Page,
  SelectInput,
  State,
  TextInput,
  useAuth,
  useNotification,
} from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// hooks
import { ProfileQueryKeys, useMyProfile, useMobileNavbar } from "hooks";
import { useProfilePhoto } from "./hooks";

// components
import { ProfilePhoto } from "./components";

// lib
import { ProfileLanguage, UpdateProfileDto } from "lib";

// types
import { ProfileFormType } from "./types";
import SectionDivider from "./SectionDivider";

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error) return error.message;

  if (typeof error === "object" && error !== null) {
    const maybeError = error as { message?: string };
    if (typeof maybeError.message === "string") return maybeError.message;
  }

  return fallback;
};

const toRenderableError = (error: unknown, fallback: string): Error => {
  if (error instanceof Error) return error;
  return new Error(getErrorMessage(error, fallback));
};

const normalizeProfileLanguage = (value?: string | null): ProfileLanguage =>
  value === "en" ? "en" : "es";

export function Profile() {
  const { t, i18n } = useTranslation();
  const manager = useManager();
  const { showErrorNotification, showSuccessNotification } = useNotification();

  const queryClient = useQueryClient();
  const { account } = useAuth();

  const profileQuery = useMyProfile({
    ensure: true,
    defaultName: account?.username ?? account?.email ?? "Profile",
  });

  const profile = profileQuery.data;

  useMobileNavbar(t("_pages:profile.title"));

  const handlePhotoUpdate = useCallback(() => {
    queryClient.invalidateQueries({ ...ProfileQueryKeys.all() });
  }, [queryClient]);

  const { isUploading, uploadPhoto, deletePhoto } = useProfilePhoto(
    profile?.id ?? 0,
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
    if (!profile) return;
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
  const formDisabled = profileQuery.isLoading || updateProfile.isPending;
  const saveDisabled =
    formDisabled ||
    !formState.isDirty ||
    !normalizedName.length ||
    normalizedName.length > 120;

  const onSubmit = handleSubmit(async (values) => {
    if (!profile) return;

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
    <Page
      title={t("_pages:profile.title")}
      isLoading={profileQuery.isLoading}
      queryKey={ProfileQueryKeys.all().queryKey}
    >
      {profileQuery.error ? (
        <ErrorView
          error={toRenderableError(
            profileQuery.error,
            t("_accessibility:errors.500"),
          )}
        />
      ) : !profile ? (
        <div className="w-full flex justify-center items-center py-10">
          <Loading />
        </div>
      ) : (
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
                      <h3 className="text-xl">
                        {currentName || profile.name || ""}
                      </h3>
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
                      onChange={(event) =>
                        field.onChange(event.currentTarget.checked)
                      }
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
      )}
    </Page>
  );
}
