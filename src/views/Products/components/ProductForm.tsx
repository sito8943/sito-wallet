import { useTranslation } from "react-i18next";
import { Controller } from "react-hook-form";

// @sito/dashboard-app
import { TextInput } from "@sito/dashboard-app";

// types
import type { ProductFormPropsType } from "../types";

export function ProductForm(props: ProductFormPropsType) {
  const { control, isLoading } = props;
  const { t } = useTranslation();

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
    </>
  );
}
