// types
import { TabPropsType } from "./types";

export const Tab = (props: TabPropsType) => {
  const { id, active, onClick, children } = props;

  return (
    <a
      href={`#${id}`}
      onClick={() => onClick()}
      className={`button submit tab ${
        active ? "primary" : "outlined"
      }`}
    >
      {children}
    </a>
  );
};
