import type { ImportPreviewDto } from "../ImportPreviewDto";
import type { SubscriptionProviderImportItemDto } from "./SubscriptionProviderImportItemDto";

export interface ImportPreviewSubscriptionProviderDto
  extends
    Omit<SubscriptionProviderImportItemDto, "id" | "image">,
    ImportPreviewDto {
  existing: boolean;
}
