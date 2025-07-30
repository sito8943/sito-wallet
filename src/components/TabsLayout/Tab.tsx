// types
import { TabPropsType } from "./types";

export const Tab = (props: TabPropsType) => {
  const { id, active, onClick, children } = props;

  return (
    <a
      href={`#${id}`}
      onClick={() => onClick()}
      className={`whitespace-nowrap button submit !px-3 !pt-2 !border-none !rounded-none ${
        active ? "primary" : "outlined"
      }`}
    >
      {children}
    </a>
  );
};
