import type { DeleteDto } from "@sito/dashboard-app";
import type { ProfileLanguage } from "./ProfileDto";

export interface UpdateProfileDto extends DeleteDto {
  name?: string;
  language?: ProfileLanguage;
  hideDeletedEntities?: boolean;
}
