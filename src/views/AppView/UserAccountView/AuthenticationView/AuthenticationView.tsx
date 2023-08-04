import "./AuthenticationView.scss";

import { useState } from "react";
import { useAppDispatch } from "../../../../redux/hooks";
import { userActions } from "../../../../redux/user/userSlice";
import UserAuthForm from "../../../../components/UserAuthForm/UserAuthForm";
import AppName from "../../../../components/AppName/AppName";
import { useNotification } from "../../../../components/Notification/NotificationProvider";
import Logo from "../../../../components/Logo/Logo";

const AuthenticationView = () => {
  const dispatch = useAppDispatch();
  const [isRegistration, setIsRegistration] = useState(false);
  const notification = useNotification();
  return (
    <div className="AuthenticationView">
      <div className="AuthenticationView__brand">
        <Logo className="AuthenticationView__brand__logo" />
        <AppName className="AuthenticationView__brand__name" />
      </div>
      <UserAuthForm
        className="AuthenticationView__auth-form"
        onLogin={async (data) => {
          await dispatch(userActions.login(data));
          notification({
            message: "user login successful!",
            icon: "mdi:user",
            type: "SUCCESS",
          });
        }}
        onRegistration={(data) => dispatch(userActions.register(data))}
        isRegistration={isRegistration}
      />
      <span className="AuthenticationView__footer">
        {isRegistration ? "Already have an account?" : "Don't have an account yet?"}
        &nbsp;
        <a className="AuthenticationView__footer__click-link" onClick={() => setIsRegistration((x) => !x)}>
          Click here
        </a>
      </span>
    </div>
  );
};

export default AuthenticationView;
