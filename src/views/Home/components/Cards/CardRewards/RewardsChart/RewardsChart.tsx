import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import type { ChartData, ChartOptions, TooltipItem } from "chart.js";

// @sito/dashboard-app
import { useTheme } from "@sito/dashboard-app";

// lib
import { formatRewardsPoints } from "lib";

// types
import type { RewardsChartPropsType } from "./types";

// utils
import { cssVar } from "../../BalanceHistory/BalanceChart/utils";
import { formatMonthLabel } from "../../SavingsProjection/utils";
import { formatCurrencyAmount } from "../utils";

import "./styles.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

/** Points earned per month; the month's eligible spend is in the tooltip. */
export const RewardsChart = (props: RewardsChartPropsType) => {
  const {
    history,
    locale = "en",
    currencySymbol = "",
    earnedLabel,
    spentLabel,
  } = props;

  // Subscribing re-renders on theme flips so the tokens below are re-read.
  useTheme();
  const barColor = cssVar("--color-text-primary", "#041e42");
  const textColor = cssVar("--color-text-muted", "#4d4d4d");
  const gridColor = cssVar("--color-border", "#cccccc");

  const data = useMemo<ChartData<"bar">>(
    () => ({
      labels: history.map((month) => formatMonthLabel(month.month, locale)),
      datasets: [
        {
          label: earnedLabel,
          data: history.map((month) => month.earned),
          backgroundColor: barColor,
          borderRadius: 4,
          maxBarThickness: 24,
        },
      ],
    }),
    [history, locale, earnedLabel, barColor],
  );

  const options = useMemo<ChartOptions<"bar">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: (items: TooltipItem<"bar">[]) => {
              const month = history[items[0].dataIndex];
              return month ? formatMonthLabel(month.month, locale, "long") : "";
            },
            label: (item: TooltipItem<"bar">) =>
              `${earnedLabel}: ${formatRewardsPoints(Number(item.raw), locale)}`,
            afterBody: (items: TooltipItem<"bar">[]) => {
              const month = history[items[0].dataIndex];
              if (!month) return [];
              return [
                `${spentLabel}: ${formatCurrencyAmount(month.spent, locale, currencySymbol)}`,
              ];
            },
          },
        },
      },
      scales: {
        x: {
          ticks: { color: textColor, maxTicksLimit: 6, autoSkip: true },
          grid: { display: false },
        },
        y: {
          beginAtZero: true,
          ticks: { color: textColor, maxTicksLimit: 5 },
          grid: { color: gridColor },
        },
      },
    }),
    [
      history,
      locale,
      currencySymbol,
      earnedLabel,
      spentLabel,
      textColor,
      gridColor,
    ],
  );

  return (
    <div className="card-rewards-chart">
      <Bar data={data} options={options} />
    </div>
  );
};
