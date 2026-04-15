import {
  SubscriptionProviderDto,
} from "lib";

import {
  CreateSubscriptionProviderMutationDto,
  SubscriptionProviderFormType,
  UpdateSubscriptionProviderMutationDto,
} from "./types";

const toNullableValue = (value: string): string | null => {
  const parsedValue = value.trim();
  return parsedValue.length ? parsedValue : null;
};

export const subscriptionProviderDtoToForm = (
  dto: SubscriptionProviderDto,
): SubscriptionProviderFormType => ({
  id: dto.id,
  name: dto.name,
  description: dto.description ?? "",
  website: dto.website ?? "",
  photo: dto.photo ?? "",
  file: null,
  removePhoto: false,
  enabled: dto.enabled,
});

export const subscriptionProviderFormToCreateDto = (
  form: SubscriptionProviderFormType,
): CreateSubscriptionProviderMutationDto => {
  return {
    payload: {
      name: form.name.trim(),
      description: toNullableValue(form.description),
      website: toNullableValue(form.website),
      enabled: !!form.enabled,
    },
    file: form.file ?? null,
  };
};

export const subscriptionProviderFormToUpdateDto = (
  form: SubscriptionProviderFormType,
): UpdateSubscriptionProviderMutationDto => {
  return {
    payload: {
      id: form.id,
      ...subscriptionProviderFormToCreateDto(form).payload,
    },
    file: form.file ?? null,
    removePhoto: !!form.removePhoto,
  };
};

export const emptyAddSubscriptionProviderForm: Omit<
  SubscriptionProviderFormType,
  "id"
> = {
  name: "",
  description: "",
  website: "",
  photo: "",
  file: null,
  removePhoto: false,
  enabled: true,
};

export const emptySubscriptionProviderForm: SubscriptionProviderFormType = {
  id: 0,
  name: "",
  description: "",
  website: "",
  photo: "",
  file: null,
  removePhoto: false,
  enabled: true,
};
