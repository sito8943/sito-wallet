import { useMemo, useCallback, useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// @emotion/css
import { css } from "@emotion/css";

// @sito/ui
import { useNotification, Button, useStyle } from "@sito/ui";

// font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

// utils
import {
  toCamelCase,
  groupByYearAndMonth,
  getMaxTotalSpent,
} from "../../utils/parsers";

// components
import Syncing from "../../components/Syncing/Syncing";

// services
import { fetchYears, fetchSpentByMonthNdYear } from "../../services/utils";

// styles
import "./styles.css";

export default function AllSpent() {
  const { t } = useTranslation();
  const { colors } = useStyle();

  const gradientBar = css({
    backgroundImage: `linear-gradient(0deg, #0093E900 45%, ${colors.secondary.light}78 100%)`,
  });

  const dashedBar = css({
    background: `repeating-linear-gradient(
      45deg,
      ${colors.secondary.default}78 0px,
      ${colors.secondary.default}78 2px,
      transparent 2px,
      transparent 9px
    )`,
  });

  const logsRef = useRef(null);

  const { setNotification } = useNotification();

  const currentMonth = useMemo(() => new Date().getMonth(), []);
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const [sync, setSync] = useState(true);
  const [years, setYears] = useState([]);
  const [columns, setColumns] = useState([]);
  const [max, setMax] = useState(0);

  const localFetchYears = useCallback(async () => {
    const { data, error } = await fetchYears();
    if (error !== null && error.message)
      setNotification({
        type: "error",
        message: t(`_accessibility:errors.${toCamelCase(error.message)}`),
      });

    const yearsSet = new Set(data.map((t) => t.year));
    setYears(Array.from(yearsSet));
    setTimeout(() => setSync(false), 300);
  }, [setNotification, t]);

  const localFetchSpentByMonthNdYear = useCallback(async () => {
    const { data, error } = await fetchSpentByMonthNdYear();
    if (error !== null && error.message)
      setNotification({
        type: "error",
        message: t(`_accessibility:errors.${toCamelCase(error.message)}`),
      });
    setColumns(groupByYearAndMonth(data));
    setMax(getMaxTotalSpent(data));
  }, [setNotification, t]);

  useEffect(() => {
    localFetchYears();
    localFetchSpentByMonthNdYear();
  }, []);

  useEffect(() => {
    if (years.length && !sync)
      setTimeout(() => {
        console.log("hola");
        logsRef?.current?.scroll({
          top: 0,
          left:
            document.getElementById(`${currentYear}-${currentMonth}`)
              ?.offsetLeft - 15,
          behavior: "smooth",
        });
      }, 500);
  }, [sync, years, logsRef, currentMonth, currentYear]);

  const fetchPercentOf = (result, total = 450) => {
    let resultR = (100 * result) / total;
    if (resultR < 80) resultR += 80;
    if (resultR >= 400) resultR = 400;
    return Math.floor(resultR);
  };

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
          <div key={year} className="year-column flex flex-col gap-2 appear">
            <h3>{year}</h3>
            <div className="months-row flex items-start justify-start">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((month) => (
                <div
                  key={month}
                  className="flex flex-col gap-2 h-[345px] justify-between"
                >
                  <Button
                    id={`${year}-${month}`}
                    color={
                      currentMonth === month && currentYear === year
                        ? "primary"
                        : "basics"
                    }
                    shape="outlined"
                    className={`button rounded-none`}
                  >
                    {t(`_accessibility:monthsReduced.${month}`)}
                  </Button>
                  <div
                    className={`animation relative all-spent-bar flex flex-col items-start justify-between ${css(
                      {
                        height: `${
                          columns[year] && columns[year][month]
                            ? fetchPercentOf(columns[year][month], max)
                            : 0
                        }px`,
                      }
                    )} ${gradientBar}`}
                  >
                    {currentMonth === month && currentYear === year ? (
                      <div
                        className={`${dashedBar} absolute top-0 left-0 w-full h-[calc(100%-36px)]`}
                      ></div>
                    ) : null}
                    <div className="top-of-the-bar secondary filled" />
                    <div className="w-full flex flex-col items-center justify-center gap-2">
                      {currentMonth === month && currentYear === year ? (
                        <div className="bottom-of-the-bar secondary filled" />
                      ) : null}
                      <p className="text-center">{columns[year][month]}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
