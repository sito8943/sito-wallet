import { DeleteDto } from "lib";

export interface BaseEntityDto extends DeleteDto {
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
