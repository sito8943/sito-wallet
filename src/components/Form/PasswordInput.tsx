import { useState, forwardRef, ForwardedRef } from "react";

// icons
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// components
import { TextInput, TextInputPropsType } from "@sito/dashboard";

export const PasswordInput = forwardRef(function (
  props: TextInputPropsType,
  ref: ForwardedRef<HTMLInputElement>
) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextInput {...props} type={showPassword ? "text" : "password"} ref={ref}>
      <button
        type="button"
        tabIndex={-1}
        className="absolute right-2 password-icon"
        onClick={() => setShowPassword(!showPassword)}
      >
        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
      </button>
    </TextInput>
  );
});
