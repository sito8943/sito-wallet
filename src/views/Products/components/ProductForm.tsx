import { useTranslation } from "react-i18next";
import { Controller, useWatch } from "react-hook-form";

// @sito/dashboard-app
import { TextInput } from "@sito/dashboard-app";

// lib
import type { PhotoFormValues } from "lib";

// components
import { PhotoField } from "components";

// types
import type { ProductFormPropsType } from "../types";

// constants
import { PRODUCT_PHOTO_INPUT_ID } from "./constants";

export function ProductForm(props: ProductFormPropsType) {
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
        name="id"
        render={({ field }) => <input {...field} type="hidden" />}
      />
      <Controller
        control={control}
        name="name"
        disabled={isLoading}
        rules={{ required: t("_entities:base.name.required") }}
        render={({ field: { value, ...rest } }) => (
          <TextInput
            required
            maxLength={255}
            autoComplete="off"
            value={value ?? ""}
            label={t("_entities:base.name.label")}
            placeholder={t("_entities:product.name.placeholder")}
            {...rest}
          />
        )}
      />
      <Controller
        control={control}
        name="alias"
        disabled={isLoading}
        render={({ field: { value, ...rest } }) => (
          <TextInput
            maxLength={255}
            autoComplete="off"
            value={value ?? ""}
            label={t("_entities:product.alias.label")}
            placeholder={t("_entities:product.alias.placeholder")}
            helperText={t("_entities:product.alias.helper")}
            {...rest}
          />
        )}
      />
      <PhotoField
        inputId={PRODUCT_PHOTO_INPUT_ID}
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
    </>
  );
}
