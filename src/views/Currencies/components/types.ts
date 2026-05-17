import type { ImportPreviewCurrencyDto } from "lib";

export type CurrencyPropsType = {
  name?: string;
  symbol?: string;
};

export type CurrencyTableProps = {
  items?: ImportPreviewCurrencyDto[] | null;
};
