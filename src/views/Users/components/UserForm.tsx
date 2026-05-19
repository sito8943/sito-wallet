import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { CheckInput, PasswordInput, TextInput } from "@sito/dashboard-app";

import { Tables } from "lib";

import type { UserFormPropsType } from "../types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function UserForm(props: UserFormPropsType) {
  const { control, isLoading, isEdit } = props;
  const { t } = useTranslation();

  return (
    <>
      <Controller
        control={control}
        render={({ field }) => <input {...field} type="hidden" />}
        name="id"
      />

      <Controller
        control={control}
        name="email"
        disabled={isLoading}
        rules={{
          required: t("_entities:user.email.required"),
          pattern: {
            value: EMAIL_PATTERN,
            message: t("_entities:user.email.required"),
          },
        }}
        render={({ field: { value, ...rest } }) => (
          <TextInput
            required
            type="email"
            maxLength={255}
            value={value ?? ""}
            label={t("_entities:user.email.label")}
            placeholder={t("_entities:user.email.placeholder")}
            autoComplete={`${Tables.Users}-${t("_entities:user.email.label")}`}
            {...rest}
          />
        )}
      />

      <Controller
        control={control}
        name="username"
        disabled={isLoading}
        render={({ field: { value, ...rest } }) => (
          <TextInput
            maxLength={120}
            value={value ?? ""}
            label={t("_entities:user.name.label")}
            placeholder={t("_entities:user.name.placeholder")}
            autoComplete={`${Tables.Users}-${t("_entities:user.name.label")}`}
            {...rest}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        disabled={isLoading}
        rules={
          isEdit
            ? undefined
            : { required: t("_entities:user.password.required") }
        }
        render={({ field: { value, ...rest } }) => (
          <PasswordInput
            required={!isEdit}
            value={value ?? ""}
            label={t("_entities:user.password.label")}
            placeholder={
              isEdit
                ? t("_pages:users.forms.passwordEditHint")
                : t("_entities:user.password.placeholder")
            }
            autoComplete={`${Tables.Users}-${t("_entities:user.password.label")}`}
            {...rest}
          />
        )}
      />

      <Controller
        control={control}
        name="admin"
        disabled={isLoading}
        render={({ field }) => (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-base-light p-3">
            <div className="flex flex-col gap-1">
              <span id="user-admin-label">
                {t("_entities:user.admin.label")}
              </span>
              <span className="text-sm text-text-muted">
                {t("_entities:user.admin.helper")}
              </span>
            </div>
            <CheckInput
              id="user-admin"
              name={field.name}
              label=""
              labelClassName="hidden"
              containerClassName="shrink-0"
              inputClassName="h-4 w-4 accent-bg-primary"
              aria-labelledby="user-admin-label"
              checked={!!field.value}
              disabled={isLoading}
              onBlur={field.onBlur}
              onChange={(event) => field.onChange(event.currentTarget.checked)}
            />
          </div>
        )}
      />
    </>
  );
}
