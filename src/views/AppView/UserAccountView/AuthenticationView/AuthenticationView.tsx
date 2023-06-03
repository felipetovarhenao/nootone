import "./AuthenticationView.scss";

import { useState } from "react";
import { useAppDispatch } from "../../../../redux/hooks";
import { login, register } from "../../../../redux/userSlice";
import UserAuthForm from "../../../../components/UserAuthForm/UserAuthForm";
import AppName from "../../../../components/AppName/AppName";
import logo from "../../../../assets/logo.png";

const AuthenticationView = () => {
  const dispatch = useAppDispatch();
  const [isRegistration, setIsRegistration] = useState(false);
  return (
    <div className="AuthenticationView">
      <div className="AuthenticationView__brand">
        <img className="AuthenticationView__brand__logo" src={logo} alt="nootone-logo" />
        <AppName className="AuthenticationView__brand__name" />
      </div>
      <UserAuthForm
        className="AuthenticationView__auth-form"
        onLogin={(data) => dispatch(login(data))}
        onRegistration={(data) => dispatch(register(data))}
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