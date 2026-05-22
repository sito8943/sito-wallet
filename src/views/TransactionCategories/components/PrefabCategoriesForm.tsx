import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

// components
import { PrefabCategoriesGrid } from "components";

// types
import type { AddPrefabCategoriesDialogPropsType } from "../types";

export function PrefabCategoriesForm(
  props: AddPrefabCategoriesDialogPropsType,
) {
  const { control, isLoading } = props;
  const { t } = useTranslation();

  return (
    <Controller
      control={control}
      name="keys"
      rules={{
        validate: (value) =>
          (Array.isArray(value) && value.length > 0) ||
          t("_pages:prefabs.errors.selectAtLeastOne"),
      }}
      render={({ field: { value, onChange } }) => (
        <PrefabCategoriesGrid
          value={value ?? []}
          onChange={onChange}
          disabled={isLoading}
        />
      )}
    />
  );
}
