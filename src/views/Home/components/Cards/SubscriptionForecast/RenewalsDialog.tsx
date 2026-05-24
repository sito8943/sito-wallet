import { useMemo } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { Dialog } from "@sito/dashboard-app";

// hooks
import { useCurrenciesCommon } from "hooks/queries/useCurrenciesCommon";

// components
import { Currency } from "../../../../Currencies";

// types
import type { RenewalsDialogPropsType } from "./types";

export const RenewalsDialog = (props: RenewalsDialogPropsType) => {
  const { open, closeDialog, renewals } = props;
  const { t, i18n } = useTranslation();
  const { data: currencies } = useCurrenciesCommon();

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(i18n.language, {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    [i18n.language],
  );

  const resolveCurrency = (currencyName: string | null) => {
    if (!currencyName) return { name: "", symbol: "" };
    const match = currencies?.find((c) => c.name === currencyName);
    return { name: currencyName, symbol: match?.symbol ?? "" };
  };

  return (
    <Dialog
      open={open}
      handleClose={closeDialog}
      title={t("_pages:home.dashboard.subscriptionForecast.details.title")}
      className="md:w-1/2 w-5/6"
    >
      {renewals.length === 0 ? (
        <p className="text-text-muted poppins py-4">
          {t("_pages:home.dashboard.subscriptionForecast.details.empty")}
        </p>
      ) : (
        <ul className="flex flex-col gap-2 py-2 max-h-[60vh] overflow-y-auto">
          {renewals.map((renewal, index) => {
            const currency = resolveCurrency(renewal.currency);
            const renewalDate = new Date(renewal.nextRenewalAt);
            const dateLabel = Number.isNaN(renewalDate.getTime())
              ? renewal.nextRenewalAt
              : dateFormatter.format(renewalDate);

            return (
              <li
                key={`${renewal.subscriptionId}-${renewal.nextRenewalAt}-${index}`}
                className="flex items-center justify-between gap-3 py-2 base-border rounded-2xl px-3"
              >
                <div className="flex flex-col min-w-0">
                  <p className="font-semibold poppins truncate">
                    {renewal.subscriptionName}
                  </p>
                  {renewal.providerName ? (
                    <p className="text-xs text-text-muted truncate">
                      {renewal.providerName}
                    </p>
                  ) : null}
                  <p className="text-xs text-text-muted">{dateLabel}</p>
                </div>
                <p className="font-bold poppins shrink-0">
                  {renewal.amount}{" "}
                  <Currency name={currency.name} symbol={currency.symbol} />
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </Dialog>
  );
};
