import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// @sito/ui
import { SelectControl, IconButton } from "@sito/ui";

// font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faFilter,
  faFilterCircleXmark,
} from "@fortawesome/free-solid-svg-icons";

// providers
import { useUser } from "../../../providers/UserProvider";

function Header({
  showFilter,
  setShowFilter,
  balanceType,
  onChangeBalanceType,
}) {
  const { t } = useTranslation();

  const extraBalances = ["all", "bills", "incomings"];

  const { userState } = useUser();

  return (
    <div className="flex items-center gap-1 w-full">
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
      <div className="flex flex-col items-start justify-start w-full">
        <h2 className="text-6xl md:text-5xl sm:text-4xl xs:text-3xl">
          {t("_pages:allSpent.title")}
        </h2>
        <div className="flex gap-2 w-full">
          <SelectControl
            value={balanceType}
            onChange={(e) => onChangeBalanceType(e.target.value)}
            className={`text-sm no-bg !pl-0`}
          >
            {extraBalances.map((extra) => (
              <option
                key={t(`_pages:allSpent.extraBalances.${extra}.id`)}
                value={t(`_pages:allSpent.extraBalances.${extra}.id`)}
              >
                {t(`_pages:allSpent.extraBalances.${extra}.description`)}
              </option>
            ))}
            {userState.balances?.map((balance) => (
              <option key={balance.id} value={balance.id}>
                {balance.description}
              </option>
            ))}
          </SelectControl>
          <IconButton
            onClick={() => setShowFilter((showFilter) => !showFilter)}
            icon={
              <FontAwesomeIcon
                icon={showFilter ? faFilterCircleXmark : faFilter}
              />
            }
          />
        </div>
      </div>
    </div>
  );
}

Header.propTypes = {
  showFilter: PropTypes.bool,
  setShowFilter: PropTypes.func,
  balanceType: PropTypes.object,
  onChangeBalanceType: PropTypes.func,
};

export default Header;
