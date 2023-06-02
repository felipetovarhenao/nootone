import cn from "classnames";
import { useState } from "react";
import Button from "../Button/Button";

type LoginForm = {
  username: string;
  password: string;
};

type RegistrationForm = LoginForm & {
  email: string;
  confirmation: string;
};

type UserFormProps = {
  onLogin?: (formData: LoginForm) => void;
  onRegistration?: (formData: RegistrationForm) => void;
  className?: string;
  isRegistration?: boolean;
};

const UserAuthForm = ({ className, onRegistration = () => {}, onLogin = () => {}, isRegistration = false }: UserFormProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmation, setConfirmation] = useState("");

  return (
    <form className={cn(className, "UserAuthForm")} onSubmit={(e) => e.preventDefault()}>
      <input value={username} onChange={(e) => setUsername(e.target.value)} id="username" name="username" type="text" placeholder="username" />
      {isRegistration && <input value={email} onChange={(e) => setEmail(e.target.value)} id="email" name="email" type="email" placeholder="email" />}
      <input value={password} onChange={(e) => setPassword(e.target.value)} id="password" name="password" type="password" placeholder="password" />
      {isRegistration && (
        <input
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          id="confirmation"
          name="confirmation"
          type="password"
          placeholder="confirmation password"
        />
      )}
      <Button onClick={() => (isRegistration ? onRegistration({ username, password, email, confirmation }) : onLogin({ username, password }))}>
        {isRegistration ? "register" : "log in"}
      </Button>
    </form>
  );
};

export default UserAuthForm;
