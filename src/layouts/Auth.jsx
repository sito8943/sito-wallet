import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

// contexts
import { useUser } from "../providers/UserProvider";

function Auth() {
  const navigate = useNavigate();

  const { userState } = useUser();

  useEffect(() => {
    if (userState.user) navigate("/");
  }, [navigate, userState]);

  return <Outlet />;
}

export default Auth;
