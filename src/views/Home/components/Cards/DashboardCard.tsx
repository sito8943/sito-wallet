import { useEffect, useMemo, useRef, useState } from "react";
import type { FieldValues, DefaultValues } from "react-hook-form";
import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faFilter,
  faGripVertical,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

// react-query
import { useMutation } from "@tanstack/react-query";

// debounce
import { useDebouncedCallback } from "use-debounce";

// @sito/dashboard-app
import {
  IconButton,
  Loading,
  classNames,
  useNotification,
  useMutationForm,
} from "@sito/dashboard-app";

// lib
import type {
  UpdateDashboardCardConfigDto,
  UpdateDashboardCardTitleDto,
} from "lib";

// local
import { BaseCard } from "./BaseCard";
import type { DashboardCardProps } from "./types";

// providers
import { useManager } from "providers";

import "./styles.css";

export type { DashboardCardProps } from "./types";

const resolveSavedConfig = <TForm extends FieldValues>(
  dtoConfig: string | undefined,
  data: TForm,
  userId: number,
  id: number,
) => {
  if (!dtoConfig) return "";

  try {
    const parsedDtoConfig = JSON.parse(dtoConfig);
    const rawSubmitPayload = { ...data, userId, id };

    if (JSON.stringify(parsedDtoConfig) === JSON.stringify(rawSubmitPayload)) {
      return JSON.stringify(data);
    }
  } catch {
    return dtoConfig;
  }

  return dtoConfig;
};

export const DashboardCard = <TForm extends FieldValues>(
  props: DashboardCardProps<TForm>,
) => {
  const {
    id,
    userId,
    title,
    config,
    onDelete,
    dragHandleProps,
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
  useEffect(() => {
    const syncTitleTimer = window.setTimeout(() => {
      setCardTitle(title ?? "");
    }, 0);

    return () => window.clearTimeout(syncTitleTimer);
  }, [title]);

  const [titleSuccess, setTitleSuccess] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setTitleSuccess(false), 1200);
    return () => clearTimeout(timer);
  }, [titleSuccess]);

  const submittedConfigStore = useRef(config ?? "");

  const updateTitle = useMutation<number, Error, UpdateDashboardCardTitleDto>({
    mutationFn: (data) => manager.Dashboard.updateCardTitle(data),
    onError: (error) => showErrorNotification({ message: error.message }),
    onSuccess: () => setTitleSuccess(true),
  });

  const debounced = useDebouncedCallback((value: string) => {
    updateTitle.mutate({ id, title: value, userId: userId ?? 0 });
  }, 500);

  useEffect(() => {
    debounced.flush();
  }, [debounced]);

  // Config form state
  const formConfig = useMemo(
    () => parseFormConfig(config),
    [config, parseFormConfig],
  );

  const formProps = useMutationForm<
    UpdateDashboardCardConfigDto,
    UpdateDashboardCardConfigDto,
    number,
    TForm
  >({
    defaultValues: formConfig as DefaultValues<TForm>,
    queryKey: ["dashboards", "card-config", id],
    formToDto: (data: TForm) => formToDto({ ...data, userId: userId ?? 0, id }),
    mutationFn: async (data: UpdateDashboardCardConfigDto) => {
      return await manager.Dashboard.updateCardConfig(data);
    },
    onSuccess: () => {
      if (onConfigSaved) onConfigSaved(submittedConfigStore.current);
      setShowFilters(false);
    },
    onSuccessMessage: t("_accessibility:messages.saved"),
    onError: () =>
      showErrorNotification({ message: t("_accessibility:errors.500") }),
  });

  const handleConfigSubmit = (data: TForm) => {
    const dto = formToDto({
      ...data,
      userId: userId ?? 0,
      id,
    });
    submittedConfigStore.current = resolveSavedConfig(
      dto.config,
      data,
      userId ?? 0,
      id,
    );
    return formProps.onSubmit(data);
  };

  const [showFilters, setShowFilters] = useState(false);

  const headerDisabled = isBusy || updateTitle.isPending || formProps.isLoading;
  const dragHandleDisabled =
    Boolean(dragHandleProps?.disabled) || headerDisabled;
  const { className: dragHandleClassName, ...restDragHandleProps } =
    dragHandleProps ?? {};

  return (
    <BaseCard className={classNames("dashboard-card", className)}>
      {loadingOverlay ? <Loading className="dashboard-card-loading" /> : null}
      <div className="dashboard-card-header">
        <input
          className="dashboard-card-title poppins"
          value={cardTitle}
          placeholder={t(
            "_pages:home.dashboard.transactionTypeResume.placeholder",
          )}
          onChange={(e) => {
            setCardTitle(e.target.value);
            debounced(e.target.value);
          }}
        />
        {updateTitle.isPending ? (
          <Loading
            className="dashboard-card-title-loading"
            strokeWidth="6"
            loaderClass="dashboard-card-title-loader"
          />
        ) : null}
        {titleSuccess ? (
          <FontAwesomeIcon
            icon={faCheckCircle}
            className="dashboard-card-title-success"
          />
        ) : null}
        {dragHandleProps ? (
          <IconButton
            {...restDragHandleProps}
            disabled={dragHandleDisabled}
            className={classNames(
              "dashboard-card-drag-handle",
              dragHandleClassName,
            )}
            icon={faGripVertical}
            data-tooltip-id={
              restDragHandleProps["data-tooltip-id"] ?? "tooltip"
            }
            data-tooltip-content={
              restDragHandleProps["data-tooltip-content"] ??
              t("_pages:home.dashboard.reorder.handle")
            }
            aria-label={
              restDragHandleProps["aria-label"] ??
              t("_pages:home.dashboard.reorder.handle")
            }
            title={
              restDragHandleProps.title ??
              t("_pages:home.dashboard.reorder.handle")
            }
          />
        ) : null}
        <IconButton
          disabled={headerDisabled}
          onClick={() => setShowFilters((v) => !v)}
          icon={faFilter}
          data-tooltip-id="tooltip"
          data-tooltip-content={t("_accessibility:buttons.filters")}
          aria-label={t("_accessibility:buttons.filters")}
        />
        <IconButton
          disabled={headerDisabled}
          onClick={onDelete}
          className="error"
          icon={faTrash}
          data-tooltip-id="tooltip"
          data-tooltip-content={t("_pages:common.actions.delete.text")}
          aria-label={t("_pages:common.actions.delete.text")}
        />
      </div>

      {/* submittedConfigStore is only read/written inside the submit handler
          and the mutation onSuccess callback, never during render. */}
      {renderActiveFilters
        ? // eslint-disable-next-line react-hooks/refs
          renderActiveFilters({
            formConfig,
            onSubmit: handleConfigSubmit,
          })
        : null}

      {children ? children({ formConfig }) : null}

      <ConfigFormDialog
        open={showFilters}
        handleClose={() => setShowFilters(false)}
        {...formProps}
        onSubmit={handleConfigSubmit}
      />
    </BaseCard>
  );
};
