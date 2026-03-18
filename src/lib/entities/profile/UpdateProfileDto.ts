import { DeleteDto } from "@sito/dashboard-app";

export interface UpdateProfileDto extends DeleteDto {
  name?: string;
  hideDeletedEntities?: boolean;
}
