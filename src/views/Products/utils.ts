import type { ProductDto } from "lib";
import { photoToFormValues, resolvePhotoPayload } from "lib";

import type {
  CreateProductMutationDto,
  ProductFormType,
  UpdateProductMutationDto,
} from "./types";

export const emptyProductForm: ProductFormType = {
  id: 0,
  name: "",
  alias: "",
  ...photoToFormValues(),
};

export const productDtoToForm = (dto: ProductDto): ProductFormType => ({
  id: dto.id,
  name: dto.name,
  alias: dto.alias ?? "",
  ...photoToFormValues(dto.photo),
});

export const productFormToAddDto = (
  form: ProductFormType,
): CreateProductMutationDto => ({
  payload: {
    name: form.name.trim(),
    alias: form.alias.trim() || null,
    photo: resolvePhotoPayload(form),
  },
  file: form.file ?? null,
});

export const productFormToUpdateDto = (
  form: ProductFormType,
): UpdateProductMutationDto => ({
  payload: { id: form.id, ...productFormToAddDto(form).payload },
  file: form.file ?? null,
});
