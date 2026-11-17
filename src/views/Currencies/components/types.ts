import type { ImportPreviewCurrencyDto } from "lib";

export type { CurrencyPropsType } from "../../../components/Currency";

export type CurrencyTableProps = {
  items?: ImportPreviewCurrencyDto[] | null;
};
