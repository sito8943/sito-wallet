import { DeleteDto } from "lib";

export interface BaseCommonEntityDto extends DeleteDto {
  updatedAt: Date;
}
