import BaseClient from "./BaseClient";

// enum
import { Tables } from "./types";

// types
import {
  CommonCurrencyDto,
  CurrencyDto,
  UpdateCurrencyDto,
  FilterCurrencyDto,
  AddCurrencyDto,
} from "lib";

export default class CurrencyClient extends BaseClient<
  CurrencyDto,
  CommonCurrencyDto,
  AddCurrencyDto,
  UpdateCurrencyDto,
  FilterCurrencyDto
> {
  /**
   */
  constructor() {
    super(Tables.Currencies);
  }
}
