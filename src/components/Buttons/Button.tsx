import { ButtonPropsType } from "./types";

// styles
import "./styles.css";

export const Button = (props: ButtonPropsType) => {
  const {
    children,
    variant = "text",
    color = "default",
    className = "",
    ...rest
  } = props;

  return (
    <button className={`button ${variant} ${color} ${className}`} {...rest}>
      {children}
    </button>
  );
};
