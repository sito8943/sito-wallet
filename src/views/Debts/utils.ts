import type {
  AddDebtDto,
  AddDebtPaymentDto,
  DebtDirection,
  DebtDto,
  UpdateDebtDto,
} from "lib";
import { DEBT_DIRECTIONS } from "lib";

import { DEFAULT_DEBT_DIRECTION } from "./constants";
import type { DebtFormType, DebtPaymentFormType } from "./types";

const parseFiniteNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === "string" && value.trim().length === 0) return fallback;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseOptionalDateTimeLocal = (value: unknown): string | null => {
  if (value === null || value === undefined) return null;
  if (typeof value !== "string") return null;

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
};

const toDateTimeLocal = (value?: string | null): string => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return typeof value === "string" ? value.slice(0, 16) : "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const nowDateTimeLocal = (): string => {
  return toDateTimeLocal(new Date().toISOString());
};

export const toDebtDirection = (value: unknown): DebtDirection => {
  const parsed = Number(value);
  if (Number.isInteger(parsed) && DEBT_DIRECTIONS.includes(parsed)) {
    return parsed as DebtDirection;
  }

  return DEFAULT_DEBT_DIRECTION;
};

export const debtDtoToForm = (dto: DebtDto): DebtFormType => {
  return {
    id: dto.id,
    counterpartyName: dto.counterpartyName ?? "",
    counterpartyContact: dto.counterpartyContact ?? "",
    title: dto.title ?? "",
    description: dto.description ?? "",
    direction: toDebtDirection(dto.direction),
    originalAmount:
      dto.originalAmount != null ? String(dto.originalAmount) : "",
    currency: dto.currency,
    issuedAt: toDateTimeLocal(dto.issuedAt),
    dueAt: toDateTimeLocal(dto.dueAt),
  };
};

export const debtFormToCreateDto = (form: DebtFormType): AddDebtDto => {
  const dueAt = parseOptionalDateTimeLocal(form.dueAt);

  return {
    counterpartyName: form.counterpartyName.trim(),
    counterpartyContact: form.counterpartyContact?.trim() || null,
    title: form.title.trim(),
    description: form.description?.trim() || null,
    direction: toDebtDirection(form.direction),
    originalAmount: parseFiniteNumber(form.originalAmount),
    currencyId: form.currency?.id ?? 0,
    issuedAt: form.issuedAt,
    ...(dueAt !== null ? { dueAt } : {}),
  };
};

export const debtFormToUpdateDto = (form: DebtFormType): UpdateDebtDto => {
  const payload = debtFormToCreateDto(form);

  return {
    id: form.id,
    ...payload,
  };
};

const createEmptyDebtFormValues = (): Omit<DebtFormType, "id"> => {
  return {
    counterpartyName: "",
    counterpartyContact: "",
    title: "",
    description: "",
    direction: DEFAULT_DEBT_DIRECTION,
    originalAmount: "",
    currency: null,
    issuedAt: nowDateTimeLocal(),
    dueAt: "",
  };
};

export const emptyDebtForm = {
  id: 0,
  ...createEmptyDebtFormValues(),
};

export const emptyDebtPaymentForm: DebtPaymentFormType = {
  debtId: 0,
  amount: "",
  paidAt: nowDateTimeLocal(),
  note: "",
  autoCreateTransaction: false,
  account: null,
  category: null,
};

export const debtPaymentFormToDto = (
  form: DebtPaymentFormType,
): AddDebtPaymentDto => {
  const autoCreateTransaction = !!form.autoCreateTransaction;
  const note = form.note?.trim() || null;

  return {
    amount: parseFiniteNumber(form.amount),
    paidAt: form.paidAt,
    autoCreateTransaction,
    ...(note !== null ? { note } : {}),
    ...(autoCreateTransaction
      ? {
          accountId: form.account?.id ?? null,
          categoryId: form.category?.id ?? null,
        }
      : {}),
  };
};
