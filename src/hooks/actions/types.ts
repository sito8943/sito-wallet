export interface UseActionPropTypes {
  hidden?: boolean;
}

export interface UseSingleActionPropTypes<TInDto> extends UseActionPropTypes {
  onClick: (record: TInDto) => void;
  hidden?: boolean;
}

export interface UseMultipleActionPropTypes<TInDto> extends UseActionPropTypes {
  onClick: (record: TInDto[]) => void;
  hidden?: boolean;
}

export enum GlobalActions {
  Add = "add",
  Edit = "edit",
  Delete = "delete",
  Restore = "restore",
}
