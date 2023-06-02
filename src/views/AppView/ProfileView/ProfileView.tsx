import { useState } from "react";
import UserAuthForm from "../../../components/UserAuthForm/UserAuthForm";
import "./ProfileView.scss";

export default function ProfileView() {
  const [isRegistration, setIsRegistration] = useState(false);
  return (
    <div className="ProfileView">
      <UserAuthForm className="auth-form" isRegistration={isRegistration} />
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
