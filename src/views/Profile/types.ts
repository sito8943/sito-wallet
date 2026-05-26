import type { ProfileDto, ProfileLanguage } from "lib";

export type ProfileFormType = {
  name: string;
  language: ProfileLanguage;
  hideDeletedEntities: boolean;
};

export type ChangePasswordFormType = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export interface ProfileFormPropsType {
  profile: ProfileDto;
}

export interface ProfilePhotoPropsType {
  profile: ProfileDto;
  isUploading: boolean;
  onUpload: (file: File) => void;
  onDelete: () => void;
}
