export type SearchWrapperPropsType = {
  isModal?: boolean;
};

export type SearchInputPropsType = {
  onClick: () => void;
  searching: string;
  setSearching: (value: string) => void;
};

export type PageResultPropsType = {
  onClick?: () => void;
  path: string;
  name: string;
  time?: string;
};

export type SearchResultType = {
  type: "page" | "entity";
} & PageResultPropsType;

export type SearchResultPropsType = {
  items: SearchResultType[];
  show?: boolean;
  recent?: SearchResultType[];
  searching: string;
  onClearRecent?: () => void;
  onRecentClick?: (item: SearchResultType) => void;
  onClose: () => void;
  isLoading: boolean;
  isModal?: boolean;
};

export type SearchModalPropsType = {
  open: boolean;
  onClose: () => void
};
