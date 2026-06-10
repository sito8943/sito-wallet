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

// types
import type { BalanceChartPropsType } from "./types";

// utils
import { cssVar, formatAxisLabel, formatTooltipTitle } from "./utils";

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

export const BalanceChart = (props: BalanceChartPropsType) => {
  const {
    points,
    granularity,
    locale = "en",
    currencySymbol = "",
    balanceLabel,
    netLabel,
  } = props;

  const lineColor = cssVar("--color-primary", "#041e42");
  const textColor = cssVar("--color-text-muted", "#4d4d4d");
  const gridColor = cssVar("--color-border", "#cccccc");

  const data = useMemo<ChartData<"line">>(
    () => ({
      labels: points.map((p) => formatAxisLabel(p, granularity, locale)),
      datasets: [
        {
          label: balanceLabel,
          data: points.map((p) => p.balance),
          borderColor: lineColor,
          backgroundColor: `${lineColor}1a`,
          borderWidth: 2,
          // declutter: dot only on first/last and where balance changes
          pointRadius: points.map((p, i) => {
            if (i === 0 || i === points.length - 1) return 3;
            return p.balance !== points[i - 1].balance ? 3 : 0;
          }),
          pointHoverRadius: 4,
          tension: 0.3,
          fill: true,
        },
      ],
    }),
    [points, granularity, locale, balanceLabel, lineColor],
  );

  const options = useMemo<ChartOptions<"line">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: (items: TooltipItem<"line">[]) => {
              const point = points[items[0].dataIndex];
              return point ? formatTooltipTitle(point) : "";
            },
            afterBody: (items: TooltipItem<"line">[]) => {
              const point = points[items[0].dataIndex];
              if (!point) return "";
              return `${netLabel}: ${point.netTotal} ${currencySymbol}`;
            },
            label: (item: TooltipItem<"line">) =>
              `${balanceLabel}: ${item.formattedValue} ${currencySymbol}`,
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
    [points, currencySymbol, balanceLabel, netLabel, textColor, gridColor],
  );

  return (
    <div className="balance-history-chart">
      <Line data={data} options={options} />
    </div>
  );
};
