import "./AppView.scss";
import { Outlet, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useEffect, useState } from "react";
import cn from "classnames";
import useViewportInfo from "../../hooks/useViewportInfo";
import MobileNavbar from "../../components/MobileNavbar/MobileNavbar";
import { useAppSelector } from "../../redux/hooks";
import Avatar from "../../components/Avatar/Avatar";

const AppView = () => {
  useViewportInfo();

  const [useDarkTheme, setUseDarkTheme] = useState(true);
  const [currentViewIndex, setCurrentViewIndex] = useState(1);
  const [viewHeader, setViewHeader] = useState("");

  const location = useLocation();
  const username = useAppSelector((state) => state.user.username);

  useEffect(() => {
    for (let i = 0; i < navbarLinks.length; i++) {
      if (location.pathname === navbarLinks[i].path) {
        setCurrentViewIndex(i);
        setViewHeader(pathToBreadcrumbs(location.pathname) || "/ playground");
        break;
      }
    }
  }, [location]);

  return (
    <div className={cn("AppView", { dark: useDarkTheme })}>
      <h1 className="AppView__header">
        {!username ? (
          <img
            className={cn("AppView__header__logo", { "--is-authenticated": username })}
            onClick={() => setUseDarkTheme((x) => !x)}
            src={logo}
            alt="nootone-logo"
          />
        ) : (
          <Avatar
            onClick={() => setUseDarkTheme((x) => !x)}
            className={cn("AppView__header__logo", { "--is-authenticated": username })}
            username={username}
          />
        )}
        <span className="AppView__header__text">{viewHeader}</span>
      </h1>
      <div className="AppView__content">
        <Outlet />
      </div>
      <MobileNavbar className="AppView__navbar" selected={currentViewIndex} links={navbarLinks} />
    </div>
  );
};

export default AppView;

const navbarLinks = [
  { icon: "carbon:user-avatar-filled-alt", path: "/app/dashboard/" },
  { icon: "material-symbols:mic", path: "/app/" },
  { icon: "carbon:workspace", path: "/app/settings/" },
  // { icon: "material-symbols:menu", path: "/app/export/" },
];

function pathToBreadcrumbs(path: string) {
  console.log(path);
  let breadCrumbs = path.split("/").slice(2);
  breadCrumbs.sort(() => -1);
  return breadCrumbs.join(" / ");
}
