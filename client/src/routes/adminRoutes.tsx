import Companies from "../pages/dashboard/pages/companies";
import Topics from "../pages/dashboard/pages/topics";
import Tickets from "../pages/dashboard/pages/tickets";
import Users from "../pages/dashboard/pages/users";
import Dashboard from "../pages/dashboard";

export const adminRoutes = [
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/companies", element: <Companies /> },
  { path: "/topics", element: <Topics /> },
  { path: "/tickets", element: <Tickets /> },
  { path: "/users", element: <Users /> },
];
