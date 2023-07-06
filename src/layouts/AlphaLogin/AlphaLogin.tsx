import "./AlphaLogin.scss";
import UserAuthForm, { LoginForm } from "../../components/UserAuthForm/UserAuthForm";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { userActions } from "../../redux/userSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import AppName from "../../components/AppName/AppName";
import { useNotification } from "../../components/Notification/NotificationProvider";
import icons from "../../utils/icons";
import CONFIG, { DeploymentType } from "../../utils/config";
import useViewportInfo from "../../hooks/useViewportInfo";
import CacheAPI from "../../utils/CacheAPI";

const AlphaLogin = () => {
  useViewportInfo();
  const dispatch = useAppDispatch();
  const { username } = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const notification = useNotification();

  async function handleLogin(formData: LoginForm) {
    const { username: u, password: p } = formData;
    return new Promise<void>((resolve, reject) => {
      if (u === "nootone-user" && p === "nootone-password") {
        dispatch(userActions.login(formData)).then(() => {
          notification({
            type: "SUCCESS",
            icon: icons.check,
            message: "Login successful!",
          });
          CacheAPI.setLocalItem<LoginForm>("alphaLogin", formData);
          resolve();
        });
      } else {
        reject("Invalid username and/or password");
      }
    });
  }

  useEffect(() => {
    if (username || CONFIG.deploymentType !== DeploymentType.PROD) {
      navigate("/app");
    } else if (!username && CONFIG.deploymentType === DeploymentType.PROD) {
      const cache = CacheAPI.getLocalItem<LoginForm>("alphaLogin");
      if (cache) {
        dispatch(userActions.login(cache));
      }
    }
  }, [username]);

  return (
    <div className="alpha-login">
      <div className="alpha-login__header">
        <div>
          <AppName className="alpha-login__header__app-name" />
        </div>
      </div>
      <UserAuthForm className="alpha-login__form" onLogin={handleLogin} />
      <div className="footer">
        <p>Hi there 👋!</p>
        <br />
        <p>We're currently in alpha testing!</p>
        <br />
        <p>
          To access the app, please login. If you've forgotten your username or password, or would like to join the testing group, please{" "}
          <a href="mailto:contact@nootone.io">contact us</a>!
        </p>
      </div>
    </div>
  );
};

export default AlphaLogin;
