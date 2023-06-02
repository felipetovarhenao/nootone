import "./AppView.scss";
import { Outlet, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useEffect, useState } from "react";
import cn from "classnames";
import useViewportInfo from "../../hooks/useViewportInfo";
import MobileNavbar from "../../components/MobileNavbar/MobileNavbar";

const AppView = () => {
  useViewportInfo();
  
  const [useDarkTheme, setUseDarkTheme] = useState(true);
  const [viewName, setViewName] = useState("record");

  const location = useLocation();

  useEffect(() => {
    let breadCrumbs = location.pathname.split("/").slice(2);
    breadCrumbs.sort(() => -1);
    setViewName(breadCrumbs.join(" / "));
  }, [location]);

  return (
    <div className={cn("AppView", { dark: useDarkTheme })}>
      <h1 className="header">
        <img onClick={() => setUseDarkTheme((x) => !x)} className="logo" src={logo} alt="nootone-logo" />
        <span className="view-name">{`${viewName}`}</span>
      </h1>
      <div className="content">
        <Outlet />
      </div>
      <MobileNavbar defaultSelection={1} className="navbar" links={navbarLinks} />
    </div>
  );
};

export default AppView;

const navbarLinks = [
  { icon: "carbon:user-avatar-filled-alt", path: "/app/profile/" },
  { icon: "material-symbols:mic", path: "/app/" },
  { icon: "mingcute:settings-6-line", path: "/app/settings/" },
  { icon: "mdi:export", path: "/app/export/" },
];
