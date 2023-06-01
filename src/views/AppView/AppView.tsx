import Icon from "../../components/Icon/Icon";
import "./AppView.scss";
import { Outlet, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useState } from "react";
import cn from "classnames";
import useViewportInfo from "../../hooks/useViewportInfo";

const AppView = () => {
  useViewportInfo();

  const [useDarkTheme, setUseDarkTheme] = useState(true);
  const [viewName, setViewName] = useState("record");
  const navigate = useNavigate();

  function handleRouteChange(route: string, viewName: string) {
    setViewName(viewName);
    navigate(route);
  }
  return (
    <div className={cn("AppView", { dark: useDarkTheme })}>
      <h1 className="header">
        <img onClick={() => setUseDarkTheme((x) => !x)} className="logo" src={logo} alt="nootone-logo" />
        <span className="view-name">{`${viewName}`}</span>
      </h1>
      <div className="content">
        <Outlet />
      </div>
      <nav className="nav-toolbar">
        <Icon
          onClick={() => handleRouteChange("/app/profile/", "profile")}
          className={cn({ "--selected": viewName === "profile" }, "icon")}
          icon="carbon:user-avatar-filled-alt"
        />
        <Icon
          onClick={() => handleRouteChange("/app/", "record")}
          className={cn({ "--selected": viewName === "record" }, "icon")}
          icon="material-symbols:mic"
        />
        <Icon
          onClick={() => handleRouteChange("/app/settings/", "settings")}
          className={cn({ "--selected": viewName === "settings" }, "icon")}
          icon="mingcute:settings-6-line"
        />
        <Icon
          onClick={() => handleRouteChange("/app/export/", "export")}
          className={cn({ "--selected": viewName === "export" }, "icon")}
          icon="mdi:export"
        />
      </nav>
    </div>
  );
};

export default AppView;
