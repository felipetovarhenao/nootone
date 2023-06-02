import { useState } from "react";
import UserAuthForm from "../../../components/UserAuthForm/UserAuthForm";
import "./ProfileView.scss";
import logo from "../../../assets/logo.png";
import AppName from "../../../components/AppName/AppName";

export default function ProfileView() {
  const [isRegistration, setIsRegistration] = useState(false);
  return (
    <div className="ProfileView">
      <div className="brand">
        <img className="logo" src={logo} alt="nootone-logo" />
        <AppName className="name" />
      </div>
      <UserAuthForm
        onLogin={(data) => console.log(data)}
        onRegistration={(data) => console.log(data)}
        className="auth-form"
        isRegistration={isRegistration}
      />
      <span className="bottom-text">
        {isRegistration ? "Already have an account?" : "Don't have an account yet?"}
        &nbsp;
        <a className="click-link" onClick={() => setIsRegistration((x) => !x)}>
          Click here
        </a>
      </span>
    </div>
  );
}
