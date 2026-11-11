import { BaseClient, Methods } from "@sito/dashboard-app";

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
import { uploadEntityPhoto } from "./fileUpload";

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
    super(
      Tables.Products,
      config.apiUrl,
      config.auth.user,
      true,
      config.auth.clientConfig,
    );
  }

  async updatePhoto(id: number, file: File): Promise<CommonProductDto> {
    return await uploadEntityPhoto<CommonProductDto>(
      `${config.apiUrl}${this.table}/${id}/photo`,
      file,
      this.api.defaultTokenAcquirer(),
    );
  }

  async deletePhoto(id: number): Promise<CommonProductDto> {
    return await this.api.doQuery<CommonProductDto>(
      `${this.table}/${id}/photo`,
      Methods.DELETE,
      undefined,
      this.api.defaultTokenAcquirer(),
    );
  }
}
