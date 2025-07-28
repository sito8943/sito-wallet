import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// types
import { ChipPropsType } from "./types.ts";

/**
 * Chip component
 * @param {object} props - component props
 * @returns Chip component
 */
export const Chip = (props: ChipPropsType) => {
  const {
    text,
    children,
    icon,
    variant = "primary",
    className = "",
    iconClassName = "text-primary",
    ...rest
  } = props;

  return (
    <div className={`chip ${variant} ${className}`} {...rest}>
      {icon ? <FontAwesomeIcon icon={icon} className={iconClassName} /> : null}
      {text ?? children}
    </div>
  );
};
