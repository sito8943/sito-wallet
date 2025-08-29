// types
import { BaseCardPropsType } from "./types";

// styles
import "./styles.css";

export const BaseCard = (props: BaseCardPropsType) => {
  const { children, className = "" } = props;

  return <article className={`base-card ${className}`}>{children}</article>;
};
