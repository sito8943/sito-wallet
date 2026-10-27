import type { AddProductDto, ProductDto, UpdateProductDto } from "lib";

import type { ProductFormType } from "./types";

export const emptyProductForm: ProductFormType = { id: 0, name: "", alias: "" };

export const productDtoToForm = (dto: ProductDto): ProductFormType => ({
  id: dto.id,
  name: dto.name,
  alias: dto.alias ?? "",
});

export const productFormToAddDto = (form: ProductFormType): AddProductDto => ({
  name: form.name.trim(),
  alias: form.alias.trim() || null,
});

export const productFormToUpdateDto = (
  form: ProductFormType,
): UpdateProductDto => ({
  id: form.id,
  ...productFormToAddDto(form),
});
