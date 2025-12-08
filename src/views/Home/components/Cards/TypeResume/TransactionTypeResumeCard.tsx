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
  queryClient,
} from "@sito/dashboard-app";

// lib
import {
  TransactionType,
  UpdateDashboardCardConfigDto,
  UpdateDashboardCardTitleDto,
} from "lib";

// hooks
import { TransactionsQueryKeys, useTransactionTypeResume } from "hooks";

// utils
import { icons } from "../../../../Transactions/components/utils";

// components
import { Currency } from "../../../../Currencies";
import { ActiveFilters } from "../ActiveFilters";
import { BaseCard } from "../BaseCard";
import { ConfigFormDialog } from "./ConfigFormDialog";

// styles
import "./styles.css";

// types
import {
  TransactionTypePropsType,
  FilterTypeResumeConfigType,
  TypeResumeTypeFormType,
} from "./types";

// providers
import { useManager } from "providers";
import { formToDto } from "./utils";

const defaultConfig: TypeResumeTypeFormType = {
  type: TransactionType.In,
  accounts: [],
  categories: [],
};

export const TransactionTypeResume = (props: TransactionTypePropsType) => {
  const { title, config, id, user, onDelete } = props;

  const { t } = useTranslation();
  const { showErrorNotification } = useNotification();
  const manager = useManager();

  const filterConfig = useMemo(() => {
    try {
      const parsed = config
        ? (JSON.parse(config) as TypeResumeTypeFormType)
        : defaultConfig;
      const transformed: FilterTypeResumeConfigType = {
        type: parsed.type,
      };

      transformed.accounts =
        parsed.accounts?.map((account) => account.id) ?? [];
      transformed.categories =
        parsed.categories?.map((category) => category.id) ?? [];
      transformed.date = parsed.date;

      return parsed;
    } catch (err) {
      console.error(err);
      return defaultConfig;
    }
  }, [config]);

  const { data, isLoading } = useTransactionTypeResume({
    ...filterConfig,
  });

  const [showFilters, setShowFilters] = useState(false);

  const [cardTitle, setCardTitle] = useState(title);
  useEffect(() => {
    setCardTitle(title);
  }, [title]);

  const [titleSuccess, setTitleSuccess] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setTitleSuccess(false), 1200);
    return () => {
      clearTimeout(timer);
    };
  }, [titleSuccess]);

  // Debounce callback
  const debounced = useDebouncedCallback(
    // function
    (value) => {
      updateTitle.mutate({
        id,
        title: value,
        userId: user?.id,
      } as UpdateDashboardCardTitleDto);
    },
    // delay in ms
    500
  );

  useEffect(() => {
    debounced.flush();
  }, [debounced]);

  const updateTitle = useMutation<number, Error, UpdateDashboardCardTitleDto>({
    mutationFn: (data) => manager.Dashboard.updateCardTitle(data),
    onError: (error: Error) => {
      showErrorNotification({ message: error.message });
    },
    onSuccess: () => {
      setTitleSuccess(true);
    },
  });

  const formConfig = useMemo(() => {
    try {
      return config
        ? (JSON.parse(config) as TypeResumeTypeFormType)
        : defaultConfig;
    } catch (err) {
      console.error(err);
      return defaultConfig;
    }
  }, [config]);

  const configFormProps = usePostForm<
    UpdateDashboardCardConfigDto,
    UpdateDashboardCardConfigDto,
    number,
    TypeResumeTypeFormType
  >({
    defaultValues: formConfig,
    formToDto: (data: TypeResumeTypeFormType) =>
      formToDto({
        ...data,
        userId: user?.id ?? 0,
        id,
      }),
    mutationFn: async (data: UpdateDashboardCardConfigDto) =>
      await manager.Dashboard.updateCardConfig(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ ...TransactionsQueryKeys.all() });
      setShowFilters(false);
    },
    onSuccessMessage: t("_accessibility:messages.saved"),
    onError: () => {
      showErrorNotification({
        message: t("_accessibility:errors.500"),
      });
    },
  });

  const globalLoading = updateTitle.isPending || isLoading;

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
        clearCategories={() =>
          configFormProps.onSubmit({ ...formConfig, categories: [] })
        }
        clearDate={() => configFormProps.onSubmit({ ...formConfig, date: undefined })}
      />
      <FontAwesomeIcon
        icon={icons[(formConfig.type ?? 0) as keyof typeof icons]}
        className={`text-lg mt-2 self-end ${
          Number(formConfig.type) === TransactionType.In
            ? "inverted-success"
            : "inverted-error"
        }`}
      />
      <p
        className={`!text-4xl font-bold self-end poppins ${
          formConfig.type === TransactionType.In
            ? "!text-bg-success"
            : "!text-bg-error"
        }`}
      >
        {data?.total}{" "}
        <Currency
          name={data?.account?.currency?.name}
          symbol={data?.account?.currency?.symbol}
        />
      </p>
      <ConfigFormDialog
        open={showFilters}
        handleClose={() => setShowFilters(false)}
        {...configFormProps}
      />
    </BaseCard>
  );
};
