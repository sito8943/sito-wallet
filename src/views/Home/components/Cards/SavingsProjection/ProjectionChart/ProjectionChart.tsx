import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import type { ChartData, ChartOptions, TooltipItem } from "chart.js";

// providers
import { useTheme } from "providers";

// types
import type { ProjectionChartPropsType } from "./types";

// utils
import { cssVar } from "../../BalanceHistory/BalanceChart/utils";
import { formatAmount, formatMonthLabel } from "../utils";
import { getPointRadius } from "./utils";

import "./styles.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);

export const ProjectionChart = (props: ProjectionChartPropsType) => {
  const {
    points,
    locale = "en",
    currencySymbol = "",
    balanceLabel,
    accruedLabel,
    creditedLabel,
    depositedLabel,
    onMonthClick,
  } = props;

  // Subscribing re-renders on theme flips so the tokens below are re-read.
  useTheme();
  const lineColor = cssVar("--color-text-primary", "#041e42");
  const textColor = cssVar("--color-text-muted", "#4d4d4d");
  const gridColor = cssVar("--color-border", "#cccccc");

  const data = useMemo<ChartData<"line">>(
    () => ({
      labels: points.map((p) => formatMonthLabel(p.month, locale)),
      datasets: [
        {
          label: balanceLabel,
          data: points.map((p) => p.closingBalance),
          borderColor: lineColor,
          backgroundColor: `${lineColor}1a`,
          borderWidth: 2,
          pointRadius: getPointRadius(points),
          pointHoverRadius: 5,
          pointHitRadius: 12,
          tension: 0.3,
          fill: true,
        },
      ],
    }),
    [points, locale, balanceLabel, lineColor],
  );

  const options = useMemo<ChartOptions<"line">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      onClick: (_event, elements) => {
        const point = elements.length ? points[elements[0].index] : undefined;
        if (point) onMonthClick?.(point.month);
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: (items: TooltipItem<"line">[]) => {
              const point = points[items[0].dataIndex];
              return point ? formatMonthLabel(point.month, locale, "long") : "";
            },
            label: (item: TooltipItem<"line">) =>
              `${balanceLabel}: ${formatAmount(Number(item.raw), locale)} ${currencySymbol}`,
            afterBody: (items: TooltipItem<"line">[]) => {
              const point = points[items[0].dataIndex];
              if (!point) return [];
              return [
                ...(point.deposited > 0
                  ? [
                      `${depositedLabel}: +${formatAmount(point.deposited, locale)} ${currencySymbol}`,
                    ]
                  : []),
                `${accruedLabel}: ${formatAmount(point.accrued, locale, 4)} ${currencySymbol}`,
                `${creditedLabel}: ${formatAmount(point.credited, locale)} ${currencySymbol}`,
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
          ticks: { color: textColor, maxTicksLimit: 5 },
          grid: { color: gridColor },
        },
      },
    }),
    [
      points,
      locale,
      currencySymbol,
      balanceLabel,
      accruedLabel,
      creditedLabel,
      depositedLabel,
      textColor,
      gridColor,
      onMonthClick,
    ],
  );

  return (
    <div className="savings-projection-chart">
      <Line data={data} options={options} />
    </div>
  );
};
