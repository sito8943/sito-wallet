import { useEffect, useState } from "react";

// lib
import { getFormattedDateTime } from "lib";

export const Clock = () => {
  const [dateNow, setDateNow] = useState(getFormattedDateTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setDateNow(getFormattedDateTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <p className="capitalize max-xs:hidden">{dateNow}</p>;
};
