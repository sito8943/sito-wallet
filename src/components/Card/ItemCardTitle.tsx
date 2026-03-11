import { ItemCardTitlePropsType } from "./types";

export const ItemCardTitle = (props: ItemCardTitlePropsType) => {
  const { children, deleted = false, className = "" } = props;

  return (
    <h3
      className={`text-lg ${className} ${
        deleted ? "!text-bg-error" : "!text-text"
      } text-start`}
    >
      {children}
    </h3>
  );
};
