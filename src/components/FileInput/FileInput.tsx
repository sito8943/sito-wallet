import { ChangeEvent, ForwardedRef, forwardRef, useState } from "react";

// types
import { FileInputPropsType } from "./types";

// styles
import "./styles.css";

// utils
import { truncateFileName } from "./utils";
import { Chip, Close } from "@sito/dashboard";
import { File } from "./File";

export const FileInput = forwardRef(function (
  props: FileInputPropsType,
  ref: ForwardedRef<HTMLInputElement>
) {
  const {
    children,
    label,
    containerClassName = "",
    inputClassName = "",
    labelClassName = "",
    helperText = "",
    helperTextClassName = "",
    iconClassName = "",
    multiple = false,
    onChange,
    onClear,
    ...rest
  } = props;

  const [files, setFiles] = useState<File[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selected]);
    }
    if (onChange) onChange(e);
  };

  const handleRemove = (index: number) => {
    setFiles((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length === 0) onClear?.();
      return next;
    });
  };

  console.log(files);

  return (
    <div className={`file-input-container ${containerClassName}`}>
      {files.length === 0 && (
        <label htmlFor={rest.name} className={`${labelClassName}`}>
          {label}
          <input
            type="file"
            ref={ref}
            multiple={multiple}
            onClick={(e) => {
              // Ensure re-opening and re-selecting the same file triggers onChange
              (e.currentTarget as HTMLInputElement).value = "";
            }}
            onChange={handleChange}
            className={`file-input ${inputClassName}`}
            {...rest}
          />
          {rest.required ? " *" : ""}
        </label>
      )}

      {files.length > 1 && (
        <ul className="file-preview-list">
          {files.map((file, i) => (
            <li key={i}>
              <span data-tooltip-id="tooltip" data-tooltip-content={file.name}>
                <Chip
                  text={truncateFileName(file.name, 25)}
                  onDelete={() => handleRemove(i)}
                />
              </span>
            </li>
          ))}
        </ul>
      )}

      {files.length === 1 && (
        <div className="file-preview">
          <File className={`file-icon ${iconClassName}`} />
          <span
            className="!cursor-default"
            data-tooltip-id="tooltip"
            data-tooltip-content={files[0]?.name ?? ""}
          >
            {truncateFileName(files[0]?.name ?? "", 25)}
          </span>
          <button
            onClick={() => {
              setFiles([]);
              onClear?.();
            }}
            className="chip-delete-button"
            type="button"
          >
            <Close />
          </button>
        </div>
      )}

      {children}
      {!!helperText && (
        <p className={`file-input-helper-text ${helperTextClassName}`}>
          {helperText}
        </p>
      )}
    </div>
  );
});
