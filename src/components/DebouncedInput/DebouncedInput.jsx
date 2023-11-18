import { useState, useEffect } from "react";
import { useDebounce } from "use-lodash-debounce";
import PropTypes from "prop-types";

function DebouncedInput(props) {
  const { onDebounceTrigger, delay = 500, initialValue, ...rest } = props;
  const [value, setValue] = useState(initialValue ?? "");
  const debounced = useDebounce(value, delay);

  useEffect(() => {
    if (value.length) onDebounceTrigger(value);
  }, [debounced]);

  return (
    <input value={value} onChange={(e) => setValue(e.target.value)} {...rest} />
  );
}

DebouncedInput.propTypes = {
  onDebounceTrigger: PropTypes.func,
  delay: PropTypes.number,
  initialValue: PropTypes.any,
};

export default DebouncedInput;
