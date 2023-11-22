import { Fragment, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

// @emotion/css
import { css } from "@emotion/css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

// @sito/ui
import { Handler } from "@sito/ui";

// providers
import { useUser } from "../../providers/UserProvider";

// components
import Navbar from "./Navbar/Navbar";

function View() {
  const { userState } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userState.user) navigate("/auth");
  }, [navigate, userState]);

  return (
    <Fragment>
      <Navbar />
      <Handler>
        <Outlet />
      </Handler>
      <div
        className={`bg-primary-default fixed w-full bottom-0 left-0 z-40 grid ${css(
          {
            gridTemplateRows: userState.cached ? "1fr" : "0fr",
            transition: "grid-template-rows 400ms ease-in-out",
          }
        )}`}
      >
        <div className="overflow-hidden">
          <p className="text-light-default text-center p-2 ">
            No hay conexión <FontAwesomeIcon icon={faExclamationCircle} />
          </p>
        </div>
      </div>
    </Fragment>
  );
}

export default View;
