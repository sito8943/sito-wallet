import { ImportPreviewDto } from "../ImportPreviewDto";
import { SubscriptionProviderImportItemDto } from "./SubscriptionProviderImportItemDto";

export interface ImportPreviewSubscriptionProviderDto
  extends Omit<SubscriptionProviderImportItemDto, "id" | "image">,
    ImportPreviewDto {
  existing: boolean;
}
