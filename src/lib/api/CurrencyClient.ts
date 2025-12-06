import { BaseClient } from "@sito/dashboard-app";
import { SupabaseAPIClient } from "./SupabaseAPIClient";

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

// config
import { config } from "../../config";

export default class CurrencyClient extends BaseClient<
  Tables,
  CurrencyDto,
  CommonCurrencyDto,
  AddCurrencyDto,
  UpdateCurrencyDto,
  FilterCurrencyDto
> {
  /**
   */
  constructor() {
    super(Tables.Currencies, config.apiUrl, config.auth.user);
    this.api = new SupabaseAPIClient(config.apiUrl, config.auth.user, true) as unknown as typeof this.api;
  }
}
