import Home from "../pages/main/home";
import Topics from "../pages/main/topics";
import Tickets from "../pages/main/tickets";

export const userRoutes = [
  { path: "/home", element: <Home /> },
  { path: "/topics", element: <Topics /> },
  { path: "/tickets", element: <Tickets /> },
];
