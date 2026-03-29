import { ProfileLanguage } from "./ProfileDto";

export interface AddProfileDto {
  name: string;
  language?: ProfileLanguage;
  hideDeletedEntities?: boolean;
}
