import { useRoutes } from "react-router-dom";

import { Home } from "./pages/Home";
import { Header } from "./components/Header/Header";
import { SideBar } from "./components/SideBar/SideBar";
import { Staffs } from "./pages/Staff";
import { MeterDetails } from "./pages/MeterDetails";
import { UserProfile } from "./pages/UserProfile";
import { RegisterNewUser } from "./pages/RegisterNewUser";
import { Vendors } from "./pages/Vendor";
import { Customers } from "./pages/Customers";
import { Installers } from "./pages/Installers";
import { Meters } from "./pages/Meters";


export const AuthorizedApp = () => {
  const routes = useRoutes([
    { path: "/", element: <Home /> },
    { path: "/staffs", element: <Staffs /> },
    { path: "/user/:userId", element: <UserProfile /> },
    { path: "*", element: <Home /> },
    { path: "/vendors", element: <Vendors /> },
    { path: "/customers", element: <Customers /> },
    { path: "/installer", element: <Installers /> },
    { path: "/meters", element: <Meters /> },
    { path: "/meter/:meterNumber", element: <MeterDetails /> },
    { path: "/user/register", element: <RegisterNewUser /> },
  ]);

  return (
    <>
      <Header />
      <main className="main">
        <SideBar />
          {routes}
      </main>
    </>
  );
}
