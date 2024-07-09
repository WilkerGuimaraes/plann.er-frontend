import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CreateTripPage } from "./page/create-trip";
import { TripDetailsPage } from "./page/trip-details";

const router = createBrowserRouter([
  {
    path: "/",
    element: <CreateTripPage />,
  },
  {
    path: "/trips/:tripid",
    element: <TripDetailsPage />,
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
