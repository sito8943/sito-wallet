// types
import type { TextLogoProps } from "./types";

import { classNames } from "@sito/dashboard-app";

// components
import Vector from "./Vector";

import "./styles.css";

function TextLogo(props: TextLogoProps) {
  const { variant = "primary" } = props;
  const titleVariantClassName = {
    primary: "text-logo-title--primary",
    secondary: "text-logo-title--secondary",
    tertiary: "text-logo-title--tertiary",
    quaternary: "text-logo-title--quaternary",
    white: "text-logo-title--white",
    black: "text-logo-title--black",
  } as const;

  return (
    <div className="text-logo">
      <Vector className="text-logo-vector" variant={variant} />
      <h1
        className={classNames("text-logo-title", titleVariantClassName[variant])}
      >
        Sito Wallet
      </h1>
    </div>
  );
}

export default TextLogo;
