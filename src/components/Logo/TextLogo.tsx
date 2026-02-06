// types
import { TextLogoProps } from "./types";

// components
import Vector from "./Vector";

function TextLogo(props: TextLogoProps) {
  const { variant = "primary" } = props;

  return (
    <div className="flex flex-col items-center gap-2 mx-auto">
      <Vector className="w-31 h-18" variant={variant} />
      <h1 className={`text-4xl font-bold text-${variant}`}>Sito Wallet</h1>
    </div>
  );
}

export default TextLogo;
