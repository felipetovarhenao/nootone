import "./AppView.scss";
import { Outlet, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useEffect, useRef, useState } from "react";
import cn from "classnames";
import useViewportInfo from "../../hooks/useViewportInfo";
import MobileNavbar from "../../components/MobileNavbar/MobileNavbar";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import Avatar from "../../components/Avatar/Avatar";
import { pushFromCache } from "../../redux/recordingsSlice";

const DEFAULT_VIEWNAME = "/ capture";

const AppView = () => {
  useViewportInfo();

  const [useDarkTheme, setUseDarkTheme] = useState(true);
  const [currentViewIndex, setCurrentViewIndex] = useState(1);
  const [viewHeader, setViewHeader] = useState(DEFAULT_VIEWNAME);

  const location = useLocation();
  const username = useAppSelector((state) => state.user.username);

  const dispatch = useAppDispatch();
  const cacheCheck = useRef(false);

  useEffect(() => {
    if (!cacheCheck.current) {
      dispatch(pushFromCache());
      cacheCheck.current = true;
    }
  }, []);

  useEffect(() => {
    for (let i = 0; i < navbarLinks.length; i++) {
      if (location.pathname === navbarLinks[i].path) {
        setCurrentViewIndex(i);
        setViewHeader(pathToBreadcrumbs(location.pathname) || DEFAULT_VIEWNAME);
        break;
      }
    }
  }, [location]);

  return (
    <div className={cn("AppView", { dark: useDarkTheme })}>
      <h1 className="AppView__header">
        {!username ? (
          <img className="AppView__header__avatar" onClick={() => setUseDarkTheme((x) => !x)} src={logo} alt="nootone-logo" />
        ) : (
          <Avatar
            size={"32px"}
            onClick={() => setUseDarkTheme((x) => !x)}
            className="AppView__header__avatar --is-authenticated"
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
  { icon: "lucide:codesandbox", path: "/app/playground/" },
];

function pathToBreadcrumbs(path: string) {
  let breadCrumbs = path.split("/").slice(2);
  breadCrumbs.sort(() => -1);
  return breadCrumbs.join(" / ");
}
