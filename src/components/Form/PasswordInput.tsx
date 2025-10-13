import { useState, forwardRef, ForwardedRef } from "react";

// icons
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

// components
import { TextInput, TextInputPropsType } from "@sito/dashboard";
import { IconButton } from "components";

export const PasswordInput = forwardRef(function (
  props: TextInputPropsType,
  ref: ForwardedRef<HTMLInputElement>
) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextInput {...props} type={showPassword ? "text" : "password"} ref={ref}>
      <IconButton
        type="button"
        tabIndex={-1}
        className="absolute right-2 password-icon"
        onClick={() => setShowPassword(!showPassword)}
        icon={showPassword ? faEyeSlash : faEye}
      />
    </TextInput>
  );
});
