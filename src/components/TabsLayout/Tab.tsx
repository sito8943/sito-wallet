import { Link } from "react-router-dom";

// types
import { TabPropsType } from "./types";

export const Tab = (props: TabPropsType) => {
  const { id, active, onClick, children, to } = props;

  return (
    <Link
      to={to ?? `#${id}`}
      onClick={() => onClick()}
      className={`button submit tab ${active ? "primary" : "outlined"}`}
    >
      {children}s
    </Link>
  );
};
