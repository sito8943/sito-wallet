import { css } from "@emotion/css";
import { classNames } from "@sito/dashboard-app";

// types
import type { ColorVignettePropsType } from "./types";

import "./styles.css";

const ColorVignette = (props: ColorVignettePropsType) => {
  const { color } = props;
  return (
    <span
      className={classNames(
        "color-vignette base-border",
        css({ backgroundColor: color }),
      )}
    ></span>
  );
};

export default ColorVignette;
