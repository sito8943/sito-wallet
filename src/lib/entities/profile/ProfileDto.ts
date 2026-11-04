import type { BaseEntityDto } from "@sito/dashboard-app";
import type { CommonUserProfileDto } from "./CommonUserProfileDto";

export type ProfileLanguage = "es" | "en";

export interface ProfileDto extends BaseEntityDto {
  name: string;
  description: string | null;
  photo: string | null;
  user: CommonUserProfileDto | null;
  language?: ProfileLanguage;
  hideDeletedEntities?: boolean;
  /** Offers the user's catalogs to other users (cloned when they use them). */
  publicCatalogs?: boolean;
}
