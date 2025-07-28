import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// providers
import { useAccount } from "../../providers/AuthProvider";
import { useHotelApiClient } from "../../providers/HotelApiProvider";

// components
import SplashScreen from "../../partials/loading/SplashScreen";

/**
 * SignOut page
 * @returns SignOut page component
 */
function SignOut() {
  const hotelApiClient = useHotelApiClient();
  const { logoutUser } = useAccount();

  const navigate = useNavigate();

  const logic = useCallback(async () => {
    await hotelApiClient.User.logout();
    logoutUser();
    setTimeout(() => {
      navigate("/auth");
    }, 1000);
  }, [hotelApiClient.User, logoutUser, navigate]);

  useEffect(() => {
    logic();
  }, [logic]);

  return <SplashScreen visible />;
}

export default SignOut;
