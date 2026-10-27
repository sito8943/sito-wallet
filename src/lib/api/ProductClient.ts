import { BaseClient } from "@sito/dashboard-app";

import { Tables } from "./types";
import type {
  AddProductDto,
  CommonProductDto,
  FilterProductDto,
  ImportPreviewDto,
  ProductDto,
  UpdateProductDto,
} from "lib";
import { config } from "../../config";

export default class ProductClient extends BaseClient<
  Tables,
  ProductDto,
  CommonProductDto,
  AddProductDto,
  UpdateProductDto,
  FilterProductDto,
  ImportPreviewDto,
  number
> {
  constructor() {
    super(Tables.Products, config.apiUrl, config.auth.user, true, {
      rememberKey: config.auth.remember,
      refreshTokenKey: config.auth.refreshTokenKey,
      accessTokenExpiresAtKey: config.auth.accessTokenExpiresAtKey,
    });
  }
}
