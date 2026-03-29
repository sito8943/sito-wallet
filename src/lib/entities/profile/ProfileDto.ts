import { BaseEntityDto } from "@sito/dashboard-app";
import { CommonUserProfileDto } from "./CommonUserProfileDto";

export type ProfileLanguage = "es" | "en";

export interface ProfileDto extends BaseEntityDto {
  name: string;
  description: string | null;
  photo: string | null;
  user: CommonUserProfileDto | null;
  language?: ProfileLanguage;
  hideDeletedEntities?: boolean;
}
