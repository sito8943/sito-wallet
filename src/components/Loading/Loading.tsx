// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

// types
import { LoadingPropsType } from "./types";

export function Loading(props: LoadingPropsType) {
  const {
    color = "text-primary",
    size = "text-xl",
    className = "",
    containerClassName = "",
  } = props;

  return (
    <div className={containerClassName}>
      <FontAwesomeIcon
        className={`rotate ${color} ${size} ${className}`}
        icon={faCircleNotch}
      />
    </div>
  );
}
