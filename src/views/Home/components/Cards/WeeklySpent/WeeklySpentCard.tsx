import { useMutation } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faFilter,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useDebouncedCallback } from "use-debounce";

// @sito/dashboard-app
import {
  usePostForm,
  useNotification,
  IconButton,
  Loading,
} from "@sito/dashboard-app";

// lib
import {
  TransactionType,
  UpdateDashboardCardConfigDto,
  UpdateDashboardCardTitleDto,
} from "lib";

// hooks
import { useTransactionTypeResume } from "hooks";

// components
import { Currency } from "../../../../Currencies";
import { BaseCard } from "../BaseCard";
import { ConfigFormDialog } from "./ConfigFormDialog";
import { ActiveFilters } from "./ActiveFilters";

// styles
import "../TypeResume/styles.css";

// types
import {
  WeeklySpentFormType,
  WeeklySpentPropsType,
  FilterWeeklyConfigType,
} from "./types";

// utils
import { formToDto } from "./utils";

// providers
import { useManager } from "providers";

const defaultConfig: WeeklySpentFormType = {
  type: TransactionType.In,
  accounts: [],
  categories: [],
};

const getCurrentWeekRange = () => {
  const today = new Date();
  const day = today.getDay(); // 0 = Sunday
  const start = new Date(today);
  start.setDate(today.getDate() - day);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  const toYMD = (d: Date) => d.toISOString().slice(0, 10);
  return { start: toYMD(start), end: toYMD(end) };
};

export const WeeklySpentCard = (props: WeeklySpentPropsType) => {
  const { title, config, id, user, onDelete } = props;
  const { t } = useTranslation();
  const { showErrorNotification } = useNotification();
  const manager = useManager();

  const formConfig = useMemo(() => {
    try {
      return (config ? JSON.parse(config) : {}) as WeeklySpentFormType;
    } catch (err) {
      console.error(err);
      return defaultConfig;
    }
  }, [config]);

  const filterConfig = useMemo(() => {
    try {
      const parsed = (config ? JSON.parse(config) : {}) as WeeklySpentFormType;
      const transformed: FilterWeeklyConfigType = {
        type: parsed.type,
      };

      transformed.accounts =
        parsed.accounts?.map((account) => account.id) ?? [];

      return transformed;
    } catch (err) {
      console.error(err);
      return defaultConfig;
    }
  }, [config]);

  const range = useMemo(() => getCurrentWeekRange(), []);

  const { data, isLoading } = useTransactionTypeResume({
    ...filterConfig,
    date: { start: range.start, end: range.end },
  });

  const [showFilters, setShowFilters] = useState(false);
  const [cardTitle, setCardTitle] = useState(title);
  const [titleSuccess, setTitleSuccess] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setTitleSuccess(false), 1200);
    return () => clearTimeout(timer);
  }, [titleSuccess]);

  const debounced = useDebouncedCallback((value: string) => {
    updateTitle.mutate({
      id,
      title: value,
      userId: user?.id,
    } as UpdateDashboardCardTitleDto);
  }, 500);

  useEffect(() => {
    debounced.flush();
  }, [debounced]);

  const updateTitle = useMutation<number, Error, UpdateDashboardCardTitleDto>({
    mutationFn: (data) => manager.Dashboard.updateCardTitle(data),
    onError: (error: Error) =>
      showErrorNotification({ message: error.message }),
    onSuccess: () => setTitleSuccess(true),
  });

  const configFormProps = usePostForm<
    UpdateDashboardCardConfigDto,
    UpdateDashboardCardConfigDto,
    number,
    WeeklySpentFormType
  >({
    defaultValues: formConfig,
    formToDto: (data: WeeklySpentFormType) =>
      formToDto({ ...data, userId: user?.id ?? 0, id }),
    mutationFn: async (data: UpdateDashboardCardConfigDto) =>
      await manager.Dashboard.updateCardConfig(data),
    onSuccess: () => setShowFilters(false),
    onSuccessMessage: t("_accessibility:messages.saved"),
    onError: () => {
      showErrorNotification({ message: t("_accessibility:errors.500") });
    },
  });

  const globalLoading = updateTitle.isPending || isLoading;
  const amount = data?.total ?? 0;
  const symbol = data?.account?.currency?.symbol ?? "";
  const name = data?.account?.currency?.name ?? "";

  return (
    <BaseCard className="type-resume-main">
      {isLoading ? <Loading className="type-resume-main-loading" /> : null}
      <div className="type-resume-header">
        <input
          className="type-resume-title poppins"
          value={cardTitle ?? ""}
          placeholder={t(
            "_pages:home.dashboard.transactionTypeResume.placeholder"
          )}
          onChange={(e) => {
            debounced(e.target.value);
            setCardTitle(e.target.value);
          }}
        />
        {updateTitle.isPending ? <Loading className="mt-1" /> : null}
        {titleSuccess ? (
          <FontAwesomeIcon
            icon={faCheckCircle}
            className="mt-1 text-bg-success"
          />
        ) : null}
        <IconButton
          disabled={globalLoading}
          onClick={() => setShowFilters(!showFilters)}
          icon={faFilter}
        />
        <IconButton
          disabled={globalLoading}
          onClick={onDelete}
          className={`error`}
          icon={faTrash}
        />
      </div>

      <ActiveFilters
        {...formConfig}
        clearAccounts={() =>
          configFormProps.onSubmit({ ...formConfig, accounts: [] })
        }
      />

      <p className="!text-4xl font-bold self-end poppins !text-bg-error">
        {isLoading ? "…" : amount} <Currency name={name} symbol={symbol} />
      </p>

      <ConfigFormDialog
        open={showFilters}
        handleClose={() => setShowFilters(false)}
        {...configFormProps}
      />
    </BaseCard>
  );
};
