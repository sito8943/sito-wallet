import { ItemCardTitlePropsType } from "./types";

export const ItemCardTitle = (props: ItemCardTitlePropsType) => {
  const { children, deleted = false } = props;

  return (
    <h3
      className={`text-lg ${
        deleted ? "!text-secondary" : "!text-text"
      } text-start`}
    >
      {children}
    </h3>
  );
};
