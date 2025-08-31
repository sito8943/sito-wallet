import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Controller } from "react-hook-form";

// @sito/dashboard
import { SelectInput } from "@sito/dashboard";

// components
import { FormDialog } from "components";

// types
import {
  AddDashboardDialogPropsType,
  DashboardFormPropsType,
} from "../../types";

// lib
import { DashboardCardType, enumToKeyValueArray } from "lib";

// providers
import { useAuth } from "providers";

export function AddDashboardCardForm(props: DashboardFormPropsType) {
  const { control, setValue, isLoading, open } = props;
  const { t } = useTranslation();
  const { account } = useAuth();

  useEffect(() => {
    if (account && setValue) setValue("userId", account?.id ?? 0);
  }, [account, setValue, open]);

  const typeOptions = useMemo(
    () => [
      ...(enumToKeyValueArray(DashboardCardType)?.map(({ key, value }) => ({
        id: value as number,
        name: t(`_entities:userDashboardCard.type.values.${key}`),
      })) ?? []),
    ],
    [t]
  );

  return (
    <>
      <Controller
        control={control}
        render={({ field }) => <input {...field} type="hidden" />}
        name="position"
      />
      <Controller
        control={control}
        render={({ field }) => <input {...field} type="hidden" />}
        name="userId"
      />
      <Controller
        control={control}
        rules={{
          required: `${t("_entities:userDashboardCard.type.required")}`,
        }}
        name="type"
        disabled={isLoading}
        render={({ field: { value, onChange, ...rest } }) => (
          <SelectInput
            required
            options={typeOptions}
            value={value}
            onChange={(e) => onChange((e.target as HTMLSelectElement).value)}
            label={t("_entities:transactionCategory.type.label")}
            {...rest}
          />
        )}
      />
    </>
  );
}

export function AddDashboardCardDialog(props: AddDashboardDialogPropsType) {
  return (
    <FormDialog {...props}>
      <AddDashboardCardForm {...props} />
    </FormDialog>
  );
}
