import { css } from "@emotion/css";

// types
import { ColorVignettePropsType } from "./types";

const ColorVignette = (props: ColorVignettePropsType) => {
  const { color } = props;
  return (
    <span
      className={`w-2 h-2 rounded-full block border border-border ${css({ backgroundColor: color })}`}
    ></span>
  );
};

export default ColorVignette;
