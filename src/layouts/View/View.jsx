import { Fragment, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

// @sito/ui
import { Handler } from "@sito/ui";

// components
import Navbar from "./Navbar/Navbar";
import { useUser } from "../../providers/UserProvider";

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
    </Fragment>
  );
}

export default View;
