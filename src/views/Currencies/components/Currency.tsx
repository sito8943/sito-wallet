import type { CurrencyPropsType } from "./types";

import "./styles.css";

export const Currency = (props: CurrencyPropsType) => {
  const { name = "", symbol = "" } = props;
  return (
    <span
      className="currency-symbol"
      data-tooltip-id="tooltip"
      data-tooltip-content={name}
    >
      {symbol}
    </span>
  );
};
