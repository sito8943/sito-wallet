import { useMemo, useCallback, useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// @sito/ui
import { useNotification, Button } from "@sito/ui";

// font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

// utils
import { toCamelCase } from "../../utils/parsers";

// components
import Syncing from "../../components/Syncing/Syncing";

// services
import { fetchYears } from "../../services/utils";

export default function AllSpent() {
  const { t } = useTranslation();

  const logsRef = useRef(null);

  const { setNotification } = useNotification();

  const currentMonth = useMemo(() => new Date().getMonth(), []);
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const [sync, setSync] = useState(false);
  const [years, setYears] = useState([]);

  const localFetchYears = useCallback(async () => {
    const { data, error } = await fetchYears();
    if (error !== null && error.message) {
      setNotification({
        type: "error",
        message: t(`_accessibility:errors.${toCamelCase(error.message)}`),
      });
    }
    const yearsSet = new Set(data.map((t) => t.year));
    setYears(Array.from(yearsSet));
  }, [setNotification, t]);

  useEffect(() => {
    localFetchYears();
  }, []);

  return (
    <main>
      <div className="p-10 sm:p-3 pt-20 mt-20 flex flex-col gap-10 flex-1">
        <div
          className={`w-10 h-10 fixed bottom-1 left-1 transition-all duration-300 ease-in-out ${
            sync ? "scale-100" : "scale-0"
          } pointer-events-none primary filled rounded-full`}
        >
          <Syncing />
        </div>
      </div>
      <div className="flex items-center">
        <Link
          to="/"
          name="to-home"
          aria-label={`${t("_accessibility:ariaLabels.goTo")} ${t(
            "_pages:routes.home"
          )}`}
          className="button icon-button primary"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </Link>
        <h2 className="text-6xl md:text-5xl sm:text-4xl xs:text-3xl">
          {t("_pages:allSpent.title")}
        </h2>
      </div>
      <div ref={logsRef} className="logs flex overflow-auto py-3 px-10 sm:px-3">
        {years.map((year) => (
          <div key={year} className="year-column flex flex-col gap-2">
            <h3>{year}</h3>
            <div className="months-row flex items-start justify-start">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((month) => (
                <Button
                  color={
                    currentMonth === month && currentYear === year
                      ? "primary"
                      : "basics"
                  }
                  shape="outlined"
                  key={month}
                  className={`button rounded-none`}
                >
                  {t(`_accessibility:monthsReduced.${month}`)}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
