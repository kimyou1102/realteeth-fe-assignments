import type { RouteObject } from "react-router-dom";
import { FavoritesPage } from "../../../pages/favorites";
import { HomePage } from "../../../pages/home";
import { RootLayout } from "./RootLayout";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "favorites",
        element: <FavoritesPage />,
      },
    ],
  },
];
