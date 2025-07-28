import { ForwardedRef, forwardRef } from "react";

// @sito/dashboard
import {
  labelStateClassName,
  inputStateClassName,
  helperTextStateClassName,
  State,
} from "@sito/dashboard";

// types
import { ParagraphInputPropsType } from "./types";

/**
 * ParagraphInput
 * @param {object} props
 * @returns ParagraphInput Component
 */
export const ParagraphInput = forwardRef(function (
  props: ParagraphInputPropsType,
  ref: ForwardedRef<HTMLTextAreaElement>
) {
  const {
    value,
    onChange,
    state = State.default,
    name = "",
    id = "",
    label = "",
    disabled = false,
    required = false,
    placeholder = "",
    containerClassName = "",
    inputClassName = "",
    labelClassName = "",
    helperText = "",
    helperTextClassName = "",
    ...rest
  } = props;

  return (
    <div
      className={`relative z-0 w-full mb-5 group ${containerClassName}`}
    >
      <textarea
        ref={ref}
        name={name}
        id={id}
        className={`text-input text-area ${inputStateClassName(state)} ${inputClassName} peer`}
        placeholder=""
        required={required}
        value={value}
        onChange={onChange}
        disabled={disabled}
        {...rest}
      ></textarea>
      <label
        htmlFor={name}
        className={`text-input-label ${labelStateClassName(state)} ${labelClassName}`}
      >
        {label}
        {required ? " *" : ""}
      </label>
      <p
        className={`text-input-helper-text ${helperTextStateClassName(state)} ${helperTextClassName}`}
      >
        {state !== "error" && state !== "good" ? placeholder : helperText}
      </p>
    </div>
  );
});
