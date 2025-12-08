import { useEffect, useMemo, useState } from "react";
import type { FieldValues, DefaultValues } from "react-hook-form";
import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faFilter, faTrash } from "@fortawesome/free-solid-svg-icons";

// react-query
import { useMutation } from "@tanstack/react-query";

// debounce
import { useDebouncedCallback } from "use-debounce";

// @sito/dashboard-app
import { IconButton, Loading, useNotification, usePostForm, DialogPropsType, FormPropsType } from "@sito/dashboard-app";

// lib
import { UpdateDashboardCardConfigDto, UpdateDashboardCardTitleDto } from "lib";

// local
import { BaseCard } from "./BaseCard";

// providers
import { useManager } from "providers";

// local types
type GenericConfigDialogProps<TForm extends FieldValues, ValidationError extends Error> =
  FormPropsType<TForm, ValidationError> & Omit<DialogPropsType, "title">;

type Common = {
  id: number;
  userId?: number;
  title: string | null;
  config?: string | null;
  onDelete: () => void;
  className?: string;
  isBusy?: boolean;
  loadingOverlay?: boolean;
};

type RenderFiltersArgs<TForm> = {
  formConfig: TForm;
  onSubmit: (updated: TForm) => void;
};

type ChildrenArgs<TForm> = {
  formConfig: TForm;
};

export type DashboardCardProps<TForm extends FieldValues, ValidationError extends Error> = Common & {
  parseFormConfig: (config?: string | null) => TForm;
  formToDto: (data: TForm & { userId: number; id: number }) => UpdateDashboardCardConfigDto;
  onConfigSaved?: () => void;
  ConfigFormDialog: (props: GenericConfigDialogProps<TForm, ValidationError>) => JSX.Element;
  renderActiveFilters?: (args: RenderFiltersArgs<TForm>) => JSX.Element | null;
  children?: (args: ChildrenArgs<TForm>) => JSX.Element | null;
};

export const DashboardCard = <TForm extends FieldValues, ValidationError extends Error>(
  props: DashboardCardProps<TForm, ValidationError>
) => {
  const {
    id,
    userId,
    title,
    config,
    onDelete,
    className = "",
    isBusy = false,
    loadingOverlay = false,
    parseFormConfig,
    formToDto,
    onConfigSaved,
    ConfigFormDialog,
    renderActiveFilters,
    children,
  } = props;

  const { t } = useTranslation();
  const { showErrorNotification } = useNotification();
  const manager = useManager();

  // Local title state + update
  const [cardTitle, setCardTitle] = useState(title ?? "");
  useEffect(() => setCardTitle(title ?? ""), [title]);

  const [titleSuccess, setTitleSuccess] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setTitleSuccess(false), 1200);
    return () => clearTimeout(timer);
  }, [titleSuccess]);

  const updateTitle = useMutation<number, Error, UpdateDashboardCardTitleDto>(
    {
      mutationFn: (data) => manager.Dashboard.updateCardTitle(data),
      onError: (error) => showErrorNotification({ message: error.message }),
      onSuccess: () => setTitleSuccess(true),
    }
  );

  const debounced = useDebouncedCallback((value: string) => {
    updateTitle.mutate({ id, title: value, userId });
  }, 500);

  useEffect(() => {
    debounced.flush();
  }, [debounced]);

  // Config form state
  const formConfig = useMemo(() => parseFormConfig(config), [config, parseFormConfig]);

  const formProps = usePostForm<UpdateDashboardCardConfigDto, UpdateDashboardCardConfigDto, number, TForm>({
    defaultValues: formConfig as DefaultValues<TForm>,
    formToDto: (data: TForm) => formToDto({ ...(data as TForm), userId: userId ?? 0, id }),
    mutationFn: async (data: UpdateDashboardCardConfigDto) => await manager.Dashboard.updateCardConfig(data),
    onSuccess: () => {
      if (onConfigSaved) onConfigSaved();
      setShowFilters(false);
    },
    onSuccessMessage: t("_accessibility:messages.saved"),
    onError: () => showErrorNotification({ message: t("_accessibility:errors.500") }),
  });

  const [showFilters, setShowFilters] = useState(false);

  const headerDisabled = isBusy || updateTitle.isPending || formProps.isLoading;

  return (
    <BaseCard className={`type-resume-main ${className}`}>
      {loadingOverlay ? <Loading className="type-resume-main-loading" /> : null}
      <div className="type-resume-header">
        <input
          className="type-resume-title poppins"
          value={cardTitle}
          placeholder={t("_pages:home.dashboard.transactionTypeResume.placeholder")}
          onChange={(e) => {
            setCardTitle(e.target.value);
            debounced(e.target.value);
          }}
        />
        {updateTitle.isPending ? <Loading className="mt-1" /> : null}
        {titleSuccess ? (
          <FontAwesomeIcon icon={faCheckCircle} className="mt-1 text-bg-success" />
        ) : null}
        <IconButton
          disabled={headerDisabled}
          onClick={() => setShowFilters((v) => !v)}
          icon={faFilter}
        />
        <IconButton disabled={headerDisabled} onClick={onDelete} className={`error`} icon={faTrash} />
      </div>

      {renderActiveFilters ? (
        renderActiveFilters({
          formConfig,
          onSubmit: (updated: TForm) => formProps.onSubmit(updated),
        })
      ) : null}

      {children ? children({ formConfig }) : null}

      <ConfigFormDialog open={showFilters} handleClose={() => setShowFilters(false)} {...formProps} />
    </BaseCard>
  );
};
