import type { PhotoFormValues } from "lib";

export type PhotoFieldPropsType = {
  inputId: string;
  values: PhotoFormValues;
  disabled?: boolean;
  onChange: (patch: Partial<PhotoFormValues>) => void;
  /** Hides the "paste an image URL" input (entities that only take uploads). */
  hideUrl?: boolean;
  /** Previewed when there is no own photo (e.g. the linked product's). */
  fallbackPhoto?: string | null;
};
