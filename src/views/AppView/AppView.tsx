import "./AppView.scss";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useEffect, useRef, useState } from "react";
import cn from "classnames";
import useViewportInfo from "../../hooks/useViewportInfo";
import MobileNavbar from "../../components/MobileNavbar/MobileNavbar";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import Avatar from "../../components/Avatar/Avatar";
import { recordingActions } from "../../redux/recordings/recordingsSlice";
import { useDarkTheme } from "../../hooks/useDarkTheme";
import findSubstringIndex from "../../utils/findSubstringIndex";
import Icon from "../../components/Icon/Icon";
import CONFIG, { DeploymentType } from "../../utils/config";
import loadTestRecordings from "../../utils/loadTestRecordings";
import getBrowser from "../../utils/getBrowser";
import { useNotification } from "../../components/Notification/NotificationProvider";

const DEFAULT_VIEWNAME = "capture";

const AppView = () => {
  useViewportInfo();

  const [currentViewIndex, setCurrentViewIndex] = useState(1);
  const [viewHeader, setViewHeader] = useState(DEFAULT_VIEWNAME);

  const location = useLocation();
  const username = useAppSelector((state) => state.user.username);
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const notification = useNotification();
  const cacheCheck = useRef(false);
  const { darkTheme } = useDarkTheme();

  const testsLoaded = useRef(false);

  useEffect(() => {
    if (!cacheCheck.current) {
      cacheCheck.current = true;
      dispatch(recordingActions.retrieveCache());
    }
  }, []);

  useEffect(() => {
    if (!testsLoaded.current && CONFIG.deploymentType === DeploymentType.DEV) {
      testsLoaded.current = true;
      loadTestRecordings((rec) => dispatch(recordingActions.addNew(rec)));
    }
  }, []);

  useEffect(() => {
    const index = findSubstringIndex(location.pathname, ["feedback", "capture", "ideas"]);
    setCurrentViewIndex(index === -1 ? 1 : index);
    const pathArray = location.pathname.split("/").filter((x) => x !== "");
    let viewName = pathArray.at(-1) === "app" ? DEFAULT_VIEWNAME : pathArray.at(-1);
    setViewHeader(`${viewName}`);
  }, [location]);

  useEffect(() => {
    if (!username && CONFIG.deploymentType === DeploymentType.PROD) {
      navigate("/beta-login");
    }
  }, [username]);

  useEffect(() => {
    const browser = getBrowser();
    if (!["Google Chrome", "Mozilla Firefox"].includes(browser)) {
      notification({
        type: "CAUTION",
        icon: "icon-park-solid:caution",
        message: "For an optimal user experience, please use Google Chrome or Mozilla Firefox.",
      });
    }
  }, []);

  return (
    <div className={cn("AppView", { dark: darkTheme })}>
      <h1 className="AppView__header">
        {!username ? (
          <img className="AppView__header__avatar" src={logo} alt="nootone-logo" />
        ) : (
          <Avatar size={"32px"} className="AppView__header__avatar --is-authenticated" username={username} />
        )}
        <span className="AppView__header__text">
          {viewHeader} <Icon icon={navbarLinks[currentViewIndex].icon} />
        </span>
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
  { icon: "ri:folder-music-fill", path: "/app/ideas" },
];
