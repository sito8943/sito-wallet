import type { ItemCardTitlePropsType } from "./types";

export const ItemCardTitle = (props: ItemCardTitlePropsType) => {
  const { children, deleted = false, className = "" } = props;

  return (
    <h3
      className={`max-sm:text-sm flex items-center gap-2 ${className} ${
        deleted ? "!text-bg-error" : "!text-text"
      } text-start`}
    >
      {children}
    </h3>
  );
};
