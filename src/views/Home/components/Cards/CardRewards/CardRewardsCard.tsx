import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGift, faPencil } from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import { Button, IconButton } from "@sito/dashboard-app";

// hooks
import { useAccountRewards } from "../../../../../hooks/queries/useAccountRewards";
import {
  useAdjustRewardsMutation,
  useEditAccountDialog,
} from "../../../../Accounts/hooks";

// components
import { EditAccountDialog } from "../../../../Accounts/components/AccountDialog";
import { AdjustRewardsDialog } from "../../../../Accounts/components/AdjustRewardsDialog";
import { ConfigFormDialog } from "./ConfigFormDialog";
import { ActiveFilters } from "./ActiveFilters";
import { RewardsSummary } from "./RewardsSummary";
import { RewardsChart } from "./RewardsChart";
import { DashboardCard } from "../DashboardCard";
import { resolveCardConfig } from "../utils";

// styles
import "../styles.css";
import "./styles.css";

// types
import type { CardRewardsPropsType } from "./types";
import { CardRewardsViewState } from "./types";
import type { CardConfigOverrideType } from "../types";

// constants
import { CARD_REWARDS_MONTHS } from "./constants";

// utils
import {
  formToDto,
  getActiveFiltersCount,
  hasRewardsActivity,
  parseFormConfig,
  resolveViewState,
  toAdjustRewardsAccount,
} from "./utils";

export const CardRewardsCard = (props: CardRewardsPropsType) => {
  const { title, config, id, user, onDelete, dragHandleProps } = props;
  const { t, i18n } = useTranslation();
  const [configOverride, setConfigOverride] =
    useState<CardConfigOverrideType | null>(null);
  const effectiveConfig = resolveCardConfig(config, configOverride);

  const { accountId, currencySymbol } = useMemo(() => {
    const parsed = parseFormConfig(effectiveConfig);
    return {
      accountId: parsed.accountId ?? undefined,
      currencySymbol: parsed.account?.currency?.symbol ?? "",
    };
  }, [effectiveConfig]);

  const { data, isLoading, error } = useAccountRewards({
    accountId,
    months: CARD_REWARDS_MONTHS,
  });

  const viewState = resolveViewState({ accountId, isLoading, error, data });

  const editAccount = useEditAccountDialog();
  const { openDialog: openEditAccount } = editAccount;

  const adjustRewards = useAdjustRewardsMutation();
  const adjustableAccount = toAdjustRewardsAccount(accountId, data);

  const renderBody = () => {
    switch (viewState) {
      case CardRewardsViewState.NoAccount:
        return (
          <p className="card-rewards-empty">
            {t("_pages:home.dashboard.cardRewards.noAccount")}
          </p>
        );
      case CardRewardsViewState.Loading:
        return null;
      case CardRewardsViewState.NotConfigured:
        return (
          <div className="card-rewards-empty">
            <p>{t("_pages:home.dashboard.cardRewards.notConfigured")}</p>
            <Button
              type="button"
              variant="outlined"
              onClick={() => accountId && openEditAccount(accountId)}
            >
              <FontAwesomeIcon icon={faPencil} />
              {t("_pages:home.dashboard.cardRewards.editAccount")}
            </Button>
          </div>
        );
      case CardRewardsViewState.Error:
        return (
          <p className="card-rewards-empty">
            {t("_pages:home.dashboard.cardRewards.error")}
          </p>
        );
      case CardRewardsViewState.Ready:
        if (!data) return null;
        return (
          <div className="card-rewards-content">
            {adjustableAccount && (
              <div className="card-rewards-actions">
                <IconButton
                  disabled={adjustRewards.isLoading}
                  onClick={() =>
                    adjustRewards.openForAccount(adjustableAccount)
                  }
                  icon={faGift}
                  data-tooltip-id="tooltip"
                  data-tooltip-content={t(
                    "_pages:accounts.actions.adjustRewards.text",
                  )}
                  aria-label={t("_pages:accounts.actions.adjustRewards.text")}
                />
              </div>
            )}
            <RewardsSummary
              data={data}
              locale={i18n.language}
              currencySymbol={currencySymbol}
            />
            {hasRewardsActivity(data) ? (
              <RewardsChart
                history={data.history}
                locale={i18n.language}
                currencySymbol={currencySymbol}
                earnedLabel={t("_pages:home.dashboard.cardRewards.earned")}
                spentLabel={t("_pages:home.dashboard.cardRewards.spent")}
              />
            ) : (
              <p className="card-rewards-hint">
                {t("_pages:home.dashboard.cardRewards.empty")}
              </p>
            )}
          </div>
        );
    }
  };

  return (
    <>
      <DashboardCard
        id={id}
        userId={user?.id ?? 0}
        title={title}
        config={effectiveConfig}
        className="card-rewards-card"
        onDelete={onDelete}
        dragHandleProps={dragHandleProps}
        isBusy={isLoading}
        loadingOverlay={isLoading}
        parseFormConfig={parseFormConfig}
        formToDto={formToDto}
        onConfigSaved={(savedConfig) =>
          setConfigOverride({ baseConfig: config, savedConfig })
        }
        ConfigFormDialog={ConfigFormDialog}
        shouldShowActiveFiltersBadge={(formConfig) =>
          !!formConfig.showFiltersAsBadge
        }
        getActiveFiltersCount={getActiveFiltersCount}
        renderActiveFilters={({ formConfig }) => (
          <ActiveFilters account={formConfig.account} />
        )}
      >
        {renderBody}
      </DashboardCard>
      <EditAccountDialog {...editAccount} />
      <AdjustRewardsDialog {...adjustRewards} />
    </>
  );
};
