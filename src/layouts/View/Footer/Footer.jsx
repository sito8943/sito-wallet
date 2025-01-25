// providers
import { useAccount } from "../../../../providers/AccountProvider";

function Footer() {
  const { account } = useAccount();

  return (
    <footer className={`w-full py-5 px-10 sm:px-3 primary filled`}>
      <div className="flex gap-2 justify-start items-start flex-wrap">
        <p className="capitalize">{account.user?.email?.split("@")[0]}</p>
        <p className="text-[#bbb] capitalize">
          {account.user?.country ?? "CU"}
        </p>
        <p className="text-[#bbb] capitalize">{account.user?.phone}</p>
      </div>
    </footer>
  );
}

export default Footer;
