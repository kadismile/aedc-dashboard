import { useRoutes } from "react-router-dom";

import { Home } from "./pages/Home";
import { Header } from "./components/Header/Header";
import { SideBar } from "./components/SideBar/SideBar";
import { Staffs } from "./pages/Staff";
import { Department } from "./pages/Department";
import { Responder } from "./pages/Responder";
import { Reporters } from "./pages/Reporters";
import { ReportDetails } from "./pages/ReportDetails";
import { UserProfile } from "./pages/UserProfile";
import { Articles } from "./pages/Articles";
import { SMSReports } from "./pages/SMSReports";
import { RegisterNewUser } from "./pages/RegisterNewUser";
import { Vendors } from "./pages/Vendor";
import { Customers } from "./pages/Customers";
import { Installers } from "./pages/Installers";
import { Meters } from "./pages/Meters";


export const AuthorizedApp = () => {
  const routes = useRoutes([
    { path: "/", element: <Home roles={'salim'}/> },
    { path: "/sms-reports", element: <SMSReports /> },
    { path: "/staffs", element: <Staffs /> },
    { path: "/user/:userId", element: <UserProfile /> },
    { path: "/department", element: <Department /> },
    { path: "/responder", element: <Responder /> },
    { path: "/reporters", element: <Reporters /> },
    { path: "*", element: <Home /> },
    { path: "/vendors", element: <Vendors /> },
    { path: "/customers", element: <Customers /> },
    { path: "/installer", element: <Installers /> },
    { path: "/meters", element: <Meters /> },
    { path: "/report/:reportSlug", element: <ReportDetails /> },
    { path: "/articles", element: <Articles /> },
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
