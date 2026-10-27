import type { PhotoFormValues } from "lib";

export type PhotoFieldPropsType = {
  inputId: string;
  values: PhotoFormValues;
  disabled?: boolean;
  onChange: (patch: Partial<PhotoFormValues>) => void;
};
