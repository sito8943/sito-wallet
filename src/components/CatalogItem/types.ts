export type CatalogItemPropsType = {
  id: number;
  name: string;
  photo?: string | null;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};
