import type { CurrencyPropsType } from "./types";

import "./styles.css";

/** Currency symbol with its name as tooltip. */
export const Currency = (props: CurrencyPropsType) => {
  const { name, symbol } = props;
  return (
    <span
      className="currency-symbol"
      data-tooltip-id="tooltip"
      data-tooltip-content={name ?? ""}
    >
      {symbol ?? ""}
    </span>
  );
};
