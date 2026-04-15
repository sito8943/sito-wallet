import { useCallback, useEffect, useMemo } from "react";
import { Controller, useWatch } from "react-hook-form";

// @sito/dashboard-app
import {
  FileInput,
  ParagraphInput,
  TextInput,
  useTranslation,
} from "@sito/dashboard-app";

// icons
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// components
import { Image } from "components";

// lib
import { Tables } from "lib";

// types
import { SubscriptionProviderFormPropsType } from "../types";

// constants
import { PHOTO_ACCEPT, SUBSCRIPTION_PROVIDER_FILE_INPUT_ID } from "./constants";

export function SubscriptionProviderForm(
  props: SubscriptionProviderFormPropsType,
) {
  const { control, isLoading, setValue } = props;
  const { t } = useTranslation();

  const selectedFile = useWatch({
    control,
    name: "file",
  }) as File | null;
  const currentPhoto =
    (useWatch({
      control,
      name: "photo",
    }) as string | null) ?? "";
  const removePhoto = !!useWatch({
    control,
    name: "removePhoto",
  });

  const previewUrl = useMemo(() => {
    if (!selectedFile) return "";
    return URL.createObjectURL(selectedFile);
  }, [selectedFile]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const hasStoredPhoto = !!currentPhoto.trim();
  const showStoredPhoto = hasStoredPhoto && !selectedFile && !removePhoto;
  const hasAnyPhoto = !!previewUrl || showStoredPhoto;

  const openFileSelector = useCallback(() => {
    const fileInput = document.getElementById(
      SUBSCRIPTION_PROVIDER_FILE_INPUT_ID,
    );
    if (fileInput instanceof HTMLInputElement) fileInput.click();
  }, []);

  const handleDeletePhoto = useCallback(() => {
    if (!setValue) return;

    if (removePhoto) {
      setValue("removePhoto", false, { shouldDirty: true });
      return;
    }

    if (selectedFile) {
      setValue("file", null, { shouldDirty: true });
      return;
    }

    if (hasStoredPhoto) {
      setValue("removePhoto", true, { shouldDirty: true });
    }
  }, [hasStoredPhoto, removePhoto, selectedFile, setValue]);

  return (
    <>
      <Controller
        control={control}
        render={({ field }) => <input {...field} type="hidden" />}
        name="id"
      />

      <Controller
        control={control}
        render={({ field: { value, ...rest } }) => (
          <input {...rest} value={value ?? ""} type="hidden" />
        )}
        name="photo"
      />

      <Controller
        control={control}
        render={({ field: { value, ...rest } }) => (
          <input {...rest} value={value ? "true" : "false"} type="hidden" />
        )}
        name="removePhoto"
      />

      <Controller
        control={control}
        name="file"
        render={({ field: { onChange, ...rest } }) => (
          <FileInput
            {...rest}
            id={SUBSCRIPTION_PROVIDER_FILE_INPUT_ID}
            unstyled
            accept={PHOTO_ACCEPT}
            inputClassName="hidden"
            onChange={(event) => {
              const file = event.currentTarget.files?.[0] ?? null;
              onChange(file);

              if (file && setValue) {
                setValue("removePhoto", false, { shouldDirty: true });
              }

              event.currentTarget.value = "";
            }}
          />
        )}
      />

      <Controller
        control={control}
        rules={{
          required: t("_entities:base.name.required"),
        }}
        name="name"
        disabled={isLoading}
        render={({ field: { value, ...rest } }) => (
          <TextInput
            required
            maxLength={120}
            value={value ?? ""}
            label={t("_entities:base.name.label")}
            placeholder={t("_entities:subscriptionProvider.name.placeholder")}
            autoComplete={`${Tables.SubscriptionProviders}-${t("_entities:base.name.label")}`}
            {...rest}
          />
        )}
      />

      <div className="flex flex-col gap-2 rounded-xl border border-border p-3">
        <p className="text-sm">
          {t("_entities:subscriptionProvider.photo.label")}
        </p>
        <div className="flex items-center gap-3">
          <div className="h-20 w-20 overflow-hidden rounded-lg bg-base-light border border-border flex items-center justify-center shrink-0">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt={t("_entities:subscriptionProvider.photo.label")}
                className="h-full w-full object-cover"
              />
            ) : showStoredPhoto ? (
              <Image
                endpoint={currentPhoto}
                fallback={<FontAwesomeIcon icon={faImage} />}
                className="h-full w-full object-cover"
                alt={t("_entities:subscriptionProvider.photo.label")}
              />
            ) : (
              <FontAwesomeIcon icon={faImage} className="text-text-muted" />
            )}
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={openFileSelector}
              disabled={isLoading}
              className="text-sm text-bg-primary underline text-left disabled:opacity-50"
            >
              {t(
                hasAnyPhoto
                  ? "_entities:subscriptionProvider.photo.replace"
                  : "_entities:subscriptionProvider.photo.upload",
              )}
            </button>

            {hasStoredPhoto || selectedFile || removePhoto ? (
              <button
                type="button"
                onClick={handleDeletePhoto}
                disabled={isLoading}
                className="text-sm text-error underline text-left disabled:opacity-50"
              >
                {removePhoto
                  ? t("_pages:common.actions.restore.text")
                  : t("_entities:subscriptionProvider.photo.delete")}
              </button>
            ) : null}

            {selectedFile ? (
              <p className="text-xs text-text-muted">
                {t("_entities:subscriptionProvider.photo.selectedFile")}:{" "}
                {selectedFile.name}
              </p>
            ) : null}

            {removePhoto && !selectedFile ? (
              <p className="text-xs text-warning">
                {t("_entities:subscriptionProvider.photo.deleteOnSave")}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <Controller
        control={control}
        name="website"
        disabled={isLoading}
        render={({ field: { value, ...rest } }) => (
          <TextInput
            type="url"
            maxLength={255}
            value={value ?? ""}
            label={t("_entities:subscriptionProvider.website.label")}
            placeholder={t(
              "_entities:subscriptionProvider.website.placeholder",
            )}
            autoComplete={`${Tables.SubscriptionProviders}-${t("_entities:subscriptionProvider.website.label")}`}
            {...rest}
          />
        )}
      />

      <Controller
        control={control}
        name="description"
        disabled={isLoading}
        render={({ field: { value, ...rest } }) => (
          <ParagraphInput
            maxLength={500}
            value={value ?? ""}
            label={t("_entities:base.description.label")}
            placeholder={t("_entities:base.description.placeholder")}
            autoComplete={`${Tables.SubscriptionProviders}-${t("_entities:base.description.label")}`}
            {...rest}
          />
        )}
      />
    </>
  );
}
