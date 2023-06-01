import Icon from "../../components/Icon/Icon";
import "./AppView.scss";
import { Outlet, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useState } from "react";
import cn from "classnames";

const AppView = () => {
  const [viewName, setViewName] = useState("record");
  const navigate = useNavigate();

  function handleRouteChange(route: string, viewName: string) {
    setViewName(viewName);
    navigate(route);
  }
  return (
    <div className="AppView dark">
      <h1 className="header">
        <img className="logo" src={logo} alt="nootone-logo" />
        <span className="view-name">{`${viewName}`}</span>
      </h1>
      <nav className="nav-toolbar">
        <Icon
          onClick={() => handleRouteChange("/app/settings/", "settings")}
          className={cn({ "--selected": viewName === "settings" }, "icon")}
          icon="ic:baseline-plus"
        />
        <Icon
          onClick={() => handleRouteChange("/app/", "record")}
          className={cn({ "--selected": viewName === "record" }, "icon")}
          icon="material-symbols:mic"
        />
        <Icon
          onClick={() => handleRouteChange("/app/export/", "export")}
          className={cn({ "--selected": viewName === "export" }, "icon")}
          icon="entypo:export"
        />
      </nav>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default AppView;
