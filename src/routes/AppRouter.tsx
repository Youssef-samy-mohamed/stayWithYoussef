import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "../layouts/MainLayout/MainLayout";
import Home from "../pages/Home/Home";
import Explore from "../pages/Explore/Explore";
import MyBookings from "../pages/MyBookings/MyBookings";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, // MainLayout stays active
    children: [
      { index: true, element: <Home /> }, // Home is rendered inside MainLayout
      {
        path: "/explore/:hotelId",
        element: <Explore />, // Explore page will also render inside MainLayout
      },
      {
        path: "/my-booking",
        element: <MyBookings />, 
      },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
