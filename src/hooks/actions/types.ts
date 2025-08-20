import { Tables } from "lib";

export interface UseActionPropTypes {
  hidden?: boolean;
  disabled?: boolean;
}

export interface UseSingleActionPropTypes<TInDto> extends UseActionPropTypes {
  onClick: (record: TInDto) => void;
  hidden?: boolean;
}

export interface UseMultipleActionPropTypes<TInDto> extends UseActionPropTypes {
  onClick: (record: TInDto[]) => void;
  hidden?: boolean;
}

export interface UseExportAction extends UseActionPropTypes {
  onClick: () => void;
  entity: Tables;
}

export enum GlobalActions {
  Add = "add",
  Edit = "edit",
  Delete = "delete",
  Restore = "restore",
  Refresh = "refresh",
  Export = "export",
}
