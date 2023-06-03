import { useState } from "react";
import UserAuthForm from "../../../components/UserAuthForm/UserAuthForm";
import "./ProfileView.scss";
import logo from "../../../assets/logo.png";
import AppName from "../../../components/AppName/AppName";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { login, logout, register } from "../../../redux/userSlice";
import Button from "../../../components/Button/Button";

export default function ProfileView() {
  const [isRegistration, setIsRegistration] = useState(false);
  const { username, loading } = useAppSelector((state) => state.user);

  const dispatch = useAppDispatch();
  return (
    <div className="ProfileView">
      {username ? (
        <>
          <div>Hello {username}!</div>
          <Button disabled={loading} onClick={() => dispatch(logout())}>
            logout
          </Button>
        </>
      ) : (
        <>
          <div className="brand">
            <img className="logo" src={logo} alt="nootone-logo" />
            <AppName className="name" />
          </div>
          <UserAuthForm
            onLogin={(data) => dispatch(login(data))}
            onRegistration={(data) => dispatch(register(data))}
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
        </>
      )}
    </div>
  );
}
