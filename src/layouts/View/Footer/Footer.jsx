// providers
import { useUser } from "../../../providers/UserProvider";

function Footer() {
  const { userState } = useUser();

  return (
    <footer className="bg-ternary-default w-full py-5 px-10 sm:px-3">
      <div className="flex gap-2 justify-start items-start flex-wrap">
        <p className="text-light-default capitalize">
          {userState.user?.email?.split("@")[0]}
        </p>
        <p className="text-[#bbb] capitalize">
          {userState.user?.country ?? "CU"}
        </p>
        <p className="text-[#bbb] capitalize">{userState.user?.phone}</p>
      </div>
    </footer>
  );
}

export default Footer;
