// providers
import { useUser } from "../../../providers/UserProvider";

function Footer() {
  const { userState } = useUser();

  return (
    <footer className="bg-primary-default w-full p-10 sm:p-3">
      <div className="flex gap-2 justify-start items-start flex-wrap">
        <p className="text-light-default capitalize">
          {userState.user?.email.split("@")[0]}
        </p>
        <p className="text-[gray] capitalize">
          {userState.user?.country ?? "CU"}
        </p>
        <p className="text-[gray] capitalize">{userState.user?.phone}</p>
      </div>
    </footer>
  );
}

export default Footer;
