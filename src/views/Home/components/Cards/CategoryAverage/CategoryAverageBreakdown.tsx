// components
import { Currency } from "../../../../Currencies";

// types
import type { CategoryAverageBreakdownPropsType } from "./types";

// constants
import { MAX_BREAKDOWN_CATEGORIES } from "./constants";

import "./styles.css";

export const CategoryAverageBreakdown = (
  props: CategoryAverageBreakdownPropsType,
) => {
  const { categories, currencyName, currencySymbol, periodLabel } = props;

  return (
    <ul className="category-average-breakdown">
      {categories.slice(0, MAX_BREAKDOWN_CATEGORIES).map((category) => (
        <li key={category.id} className="category-average-breakdown-item">
          <span className="category-average-breakdown-name">
            {category.color ? (
              <span
                className="category-average-breakdown-dot"
                style={{ backgroundColor: category.color }}
              />
            ) : null}
            {category.name}
          </span>
          <span className="category-average-breakdown-value">
            {category.averagePerPeriod}{" "}
            <Currency name={currencyName} symbol={currencySymbol} />
            <small className="category-average-breakdown-period">
              /{periodLabel}
            </small>
          </span>
        </li>
      ))}
    </ul>
  );
};
