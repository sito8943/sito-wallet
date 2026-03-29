import { DeleteDto } from "@sito/dashboard-app";
import { ProfileLanguage } from "./ProfileDto";

export interface UpdateProfileDto extends DeleteDto {
  name?: string;
  language?: ProfileLanguage;
  hideDeletedEntities?: boolean;
}
