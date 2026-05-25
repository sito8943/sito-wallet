// types
import type { TextLogoProps } from "./types";

import { classNames } from "@sito/dashboard-app";

// components
import Vector from "./Vector";

import "./styles.css";

function TextLogo(props: TextLogoProps) {
  const { variant = "primary" } = props;

  return (
    <div className="text-logo">
      <Vector className="text-logo-vector" variant={variant} />
      <h1
        className={classNames("text-logo-title", `text-logo-title--${variant}`)}
      >
        Sito Wallet
      </h1>
    </div>
  );
}

export default TextLogo;
