import "./BetaLogin.scss";
import UserAuthForm, { LoginForm } from "../../components/UserAuthForm/UserAuthForm";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { userActions } from "../../redux/user/userSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import AppName from "../../components/AppName/AppName";
import { useNotification } from "../../components/Notification/NotificationProvider";
import icons from "../../utils/icons";
import CONFIG, { DeploymentType } from "../../utils/config";
import useViewportInfo from "../../hooks/useViewportInfo";
import CacheAPI from "../../utils/CacheAPI";
import EmailListForm from "../EmailListForm/EmailListForm";
import Icon from "../../components/Icon/Icon";

const BetaLogin = () => {
  useViewportInfo();
  const dispatch = useAppDispatch();
  const { username } = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
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
          CacheAPI.setLocalItem<LoginForm>("betaLogin", formData);
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
      const cache = CacheAPI.getLocalItem<LoginForm>("betaLogin");
      if (cache) {
        dispatch(userActions.login(cache));
      }
    }
  }, [username]);

  return (
    <div className="beta-login">
      <div className="beta-login__header">
        <div>
          <AppName className="beta-login__header__app-name" />
        </div>
      </div>
      {!showForm ? (
        <>
          <UserAuthForm className="beta-login__form" onLogin={handleLogin} />
          <div className="footer">
            <p>Hi there 👋!</p>
            <br />
            <p>We're currently in beta testing!</p>
            <br />
            <p>
              To access the app, please login. If you've forgotten your username or password, or would like to join the testing group, please fill out
              the{" "}
              <span className="beta-login__footer__link" onClick={() => setShowForm(true)}>
                sign-up form
              </span>
            </p>
          </div>
        </>
      ) : (
        <div className="beta-login__sign-up">
          <div className="beta-login__sign-up__back" onClick={() => setShowForm(false)}>
            <Icon className="beta-login__sign-up__back__icon" icon={icons.back} />
            <span className="beta-login__sign-up__back__text">back to login</span>
          </div>
          <span className="beta-login__sign-up__text">Sign up to receive updates, talk to us, or join our beta-testing group!</span>
          <EmailListForm className={"beta-login__sign-up__form"} />
        </div>
      )}
    </div>
  );
};

export default BetaLogin;
