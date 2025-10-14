import { useEffect, useState } from "react";

// @sito/dashboard
import { getFormattedDateTime } from "@sito/dashboard-app";

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
