import type { PurchaseProviderDto } from "lib";
import { photoToFormValues, resolvePhotoPayload } from "lib";

import type {
  CreatePurchaseProviderMutationDto,
  PurchaseProviderFormType,
  UpdatePurchaseProviderMutationDto,
} from "./types";

export const emptyPurchaseProviderForm: PurchaseProviderFormType = {
  id: 0,
  name: "",
  ...photoToFormValues(),
};

export const purchaseProviderDtoToForm = (
  dto: PurchaseProviderDto,
): PurchaseProviderFormType => ({
  id: dto.id,
  name: dto.name,
  ...photoToFormValues(dto.photo),
});

export const purchaseProviderFormToAddDto = (
  form: PurchaseProviderFormType,
): CreatePurchaseProviderMutationDto => ({
  payload: {
    name: form.name.trim(),
    photo: resolvePhotoPayload(form),
  },
  file: form.file ?? null,
});

export const purchaseProviderFormToUpdateDto = (
  form: PurchaseProviderFormType,
): UpdatePurchaseProviderMutationDto => ({
  payload: { id: form.id, ...purchaseProviderFormToAddDto(form).payload },
  file: form.file ?? null,
});
