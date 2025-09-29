import { Loading } from "@sito/dashboard";

export function SplashScreen() {
  return <div className="w-screen h-screen flex items-center justify-center overflow-hidden">
    <Loading className="blur-appear" />
  </div>;
}
