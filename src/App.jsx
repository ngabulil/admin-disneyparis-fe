import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";

import LoginPage from "./pages/LoginPage";
import LocationPage from "./pages/LocationPage";
import DashboardLayout from "./layouts/DashboardLayout";
import VehiclePage from "./pages/VehiclePage";
import HotelPage from "./pages/HotelPage";
import TerminalPage from "./pages/TerminalPage";
import TripPage from "./pages/TripPage";
import PricingVehiclePage from "./pages/PricingVehiclePage";
import PromoPage from "./pages/PromoPage";
import BookingPage from "./pages/BookingPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    element: <DashboardLayout />,
    children: [
      {
        path: "/location",
        element: <LocationPage />,
      },
      {
        path: "/vehicle",
        element: <VehiclePage />,
      },
      {
        path: "/hotel",
        element: <HotelPage />,
      },

      {
        path: "/terminal",
        element: <TerminalPage />,
      },

      {
        path: "/trip",
        element: <TripPage />,
      },
      {
        path: "/pricing-vehicle",
        element: <PricingVehiclePage />,
      },

      {
        path: "/promo",
        element: <PromoPage />,
      },
      {
        path: "/booking",
        element: <BookingPage />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
