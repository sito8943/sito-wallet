import { ImportPreviewDto } from "./ImportPreviewDto";

export type ImportDto<TDto extends ImportPreviewDto> = {
  items: TDto[];
  override: boolean;
};
