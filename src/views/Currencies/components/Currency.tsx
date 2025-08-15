import { CurrencyPropsType } from "./types";

export const Currency = (props: CurrencyPropsType) => {
  const { name = "", symbol = "" } = props;
  return (
    <span data-tooltip-id="tooltip" data-tooltip-content={name}>
      {symbol}
    </span>
  );
};
