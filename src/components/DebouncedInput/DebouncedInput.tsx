import { useState, useEffect } from "react";
import { useDebounce } from "use-lodash-debounce";
import { DebounceInputPropsType } from "./types";

export function DebouncedInput(props: DebounceInputPropsType) {
  const { onDebounceTrigger, delay = 500, initialValue, ...rest } = props;
  const [value, setValue] = useState(initialValue ?? "");
  const debounced = useDebounce(value, delay);

  useEffect(() => {
    if (value.length) onDebounceTrigger(value);
  }, [debounced, onDebounceTrigger, value]);

  return (
    <input value={value} onChange={(e) => setValue(e.target.value)} {...rest} />
  );
}
