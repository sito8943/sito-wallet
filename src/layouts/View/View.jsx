import { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { scrollTo } from "some-javascript-utils/browser";
import { useTranslation } from "react-i18next";

// @emotion/css
import { css } from "@emotion/css";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

// @sito/ui
import { Handler } from "@sito/ui";

// providers
import { useUser } from "../../providers/UserProvider";

// components
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";

function View() {
  const { userState } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const { t } = useTranslation();

  useEffect(() => {
    if (!userState.user) navigate("/auth");
  }, [navigate, userState]);

  useEffect(() => {
    setTimeout(() => {
      scrollTo(0, 0);
    }, [200]);
  }, [location.pathname]);

  return (
    <div>
      <Navbar />
      <div className="viewport">
        <Handler>
          <Outlet />
        </Handler>
      </div>
      <div
        className={`secondary filled fixed w-full bottom-0 left-0 z-[1] grid ${css(
          {
            gridTemplateRows: userState.cached ? "1fr" : "0fr",
            transition: "grid-template-rows 400ms ease-in-out",
          }
        )}`}
      >
        <div className="overflow-hidden">
          <p className="text-center p-2">
            {t("_accessibility:errors.failedToFetch")}{" "}
            <FontAwesomeIcon icon={faExclamationCircle} />
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default View;
