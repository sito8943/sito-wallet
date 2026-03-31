export type CurrencyPropsType = {
  name?: string;
  symbol?: string;
};

export type CurrencyTableProps = {
  items?: import("lib").ImportPreviewCurrencyDto[] | null;
};
