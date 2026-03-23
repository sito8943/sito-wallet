import { ProfileDto } from "lib";

export type ProfileFormType = {
  name: string;
  hideDeletedEntities: boolean;
};

export interface ProfilePhotoPropsType {
  profile: ProfileDto;
  isUploading: boolean;
  onUpload: (file: File) => void;
  onDelete: () => void;
}
