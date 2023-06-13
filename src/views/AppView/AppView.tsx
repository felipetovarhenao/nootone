import "./AppView.scss";
import { Outlet, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useEffect, useRef, useState } from "react";
import cn from "classnames";
import useViewportInfo from "../../hooks/useViewportInfo";
import MobileNavbar from "../../components/MobileNavbar/MobileNavbar";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import Avatar from "../../components/Avatar/Avatar";
import { recordingActions } from "../../redux/recordings/recordingsSlice";
import { useDarkTheme } from "../../hooks/useDarkTheme";

const DEFAULT_VIEWNAME = "/ capture";

const AppView = () => {
  useViewportInfo();

  const [currentViewIndex, setCurrentViewIndex] = useState(1);
  const [viewHeader, setViewHeader] = useState(DEFAULT_VIEWNAME);

  const location = useLocation();
  const username = useAppSelector((state) => state.user.username);

  const dispatch = useAppDispatch();
  const cacheCheck = useRef(false);
  const { darkTheme } = useDarkTheme();

  useEffect(() => {
    if (!cacheCheck.current) {
      cacheCheck.current = true;
      dispatch(recordingActions.retrieveCache());
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
    <div className={cn("AppView", { dark: darkTheme })}>
      <h1 className="AppView__header">
        {!username ? (
          <img className="AppView__header__avatar" src={logo} alt="nootone-logo" />
        ) : (
          <Avatar size={"32px"} className="AppView__header__avatar --is-authenticated" username={username} />
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
  // { icon: "carbon:user-avatar-filled-alt", path: "/app/dashboard/" },
  { icon: "ic:baseline-feedback", path: "/app/feedback" },
  { icon: "material-symbols:mic", path: "/app/" },
  { icon: "lucide:codesandbox", path: "/app/play/" },
];

function pathToBreadcrumbs(path: string) {
  let breadCrumbs = path.split("/").slice(2);
  breadCrumbs.sort(() => -1);
  return breadCrumbs.join(" / ");
}
