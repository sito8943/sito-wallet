import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// types
import { EmptyPropsType } from "./types";

// lib
import { BaseEntityDto } from "lib";

// components
import { Action } from "components";

export const Empty = <TRow extends BaseEntityDto>(
  props: EmptyPropsType<TRow>
) => {
  const {
    message,
    messageProps = { className: "text-gray-400 text-balance text-center" },
    action,
    iconProps,
  } = props;
  return (
    <div className="flex flex-col items-center justify-center gap-5 pt-5">
      {iconProps && <FontAwesomeIcon {...(iconProps ?? {})} />}
      <p {...(messageProps ?? {})}>{message}</p>
      {action && <Action showTooltips={false} showText={true} {...action} />}
    </div>
  );
};
