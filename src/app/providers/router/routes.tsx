import type { RouteObject } from "react-router-dom";
import { FavoritesPage } from "../../../pages/favorites";
import { HomePage } from "../../../pages/home";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/favorites",
    element: <FavoritesPage />,
  },
];
