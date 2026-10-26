import { Controller, useWatch } from "react-hook-form";

// @sito/dashboard-app
import { ParagraphInput, TextInput, useTranslation } from "@sito/dashboard-app";

// lib
import type { PhotoFormValues } from "lib";
import { Tables } from "lib";

// components
import { PhotoField } from "components";

// types
import type { SubscriptionProviderFormPropsType } from "../types";

// constants
import { SUBSCRIPTION_PROVIDER_FILE_INPUT_ID } from "./constants";

import "./styles.css";

export function SubscriptionProviderForm(
  props: SubscriptionProviderFormPropsType,
) {
  const { control, isLoading, setValue } = props;
  const { t } = useTranslation();

  const [photo, photoUrl, file, removePhoto] = useWatch({
    control,
    name: ["photo", "photoUrl", "file", "removePhoto"],
  });

  return (
    <>
      <Controller
        control={control}
        render={({ field }) => <input {...field} type="hidden" />}
        name="id"
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

      <PhotoField
        inputId={SUBSCRIPTION_PROVIDER_FILE_INPUT_ID}
        disabled={isLoading}
        values={{ photo, photoUrl, file, removePhoto }}
        onChange={(patch) =>
          Object.entries(patch).forEach(([key, value]) =>
            setValue?.(key as keyof PhotoFormValues, value, {
              shouldDirty: true,
            }),
          )
        }
      />

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
