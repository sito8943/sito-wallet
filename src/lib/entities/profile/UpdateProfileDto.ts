import type { DeleteDto } from "@sito/dashboard-app";
import type { ProfileLanguage } from "./ProfileDto";

export interface UpdateProfileDto extends DeleteDto {
  name?: string;
  language?: ProfileLanguage;
  hideDeletedEntities?: boolean;
  /** Offers the user's catalogs to other users (cloned when they use them). */
  publicCatalogs?: boolean;
}
