import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

// @emotion/css
import { css } from "@emotion/css";

// font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

// @sito/ui
import { SelectControl, InputControl } from "@sito/ui";

function Filters({
  year,
  years,
  setYear,
  month,
  setMonth,
  showFilter,
  searchValue,
  setSearchValue,
}) {
  const { t } = useTranslation();

  return (
    <div
      className={`accordion ${css({
        gridTemplateRows: showFilter ? "1fr" : "0fr",
      })}`}
    >
      <div className="flex flex-col gap-2 overflow-hidden">
        <InputControl
          label={t("_accessibility:description")}
          leftComponent={
            <FontAwesomeIcon className="opacity-70" icon={faSearch} />
          }
          value={searchValue}
          className={`text-sm`}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <div className="flex gap-2">
          <SelectControl
            label={t("_accessibility:year")}
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value={-1}>
              {t(`_pages:allSpent.extraBalances.all.description`)}
            </option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </SelectControl>
          <SelectControl
            value={month}
            label={t("_accessibility:month")}
            onChange={(e) => setMonth(e.target.value)}
          >
            <option value={-1}>
              {t(`_pages:allSpent.extraBalances.all.description`)}
            </option>
            {[0, 1, 2, 3, 4, 5, 6, 7, 9, 10, 11].map((month) => (
              <option key={month} value={month}>
                {t(`_accessibility:months.${month}`)}
              </option>
            ))}
          </SelectControl>
        </div>
      </div>
    </div>
  );
}

Filters.propTypes = {
  year: PropTypes.string,
  years: PropTypes.array,
  setYear: PropTypes.func,
  month: PropTypes.number,
  setMonth: PropTypes.func,
  showFilter: PropTypes.bool,
  searchValue: PropTypes.string,
  setSearchValue: PropTypes.func,
};

export default Filters;
