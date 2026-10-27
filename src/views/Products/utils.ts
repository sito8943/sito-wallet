import type { AddProductDto, ProductDto, UpdateProductDto } from "lib";

import type { ProductFormType } from "./types";

export const emptyProductForm: ProductFormType = { id: 0, name: "" };

export const productDtoToForm = (dto: ProductDto): ProductFormType => ({
  id: dto.id,
  name: dto.name,
});

export const productFormToAddDto = (form: ProductFormType): AddProductDto => ({
  name: form.name.trim(),
});

export const productFormToUpdateDto = (
  form: ProductFormType,
): UpdateProductDto => ({
  id: form.id,
  ...productFormToAddDto(form),
});
