import { Outlet } from "react-router-dom";
import { HomeHeader } from "../../../widgets/home-header/HomeHeader";

export function RootLayout() {
  return (
    <>
      <HomeHeader />
      <Outlet />
    </>
  );
}
