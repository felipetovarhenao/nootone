import "./UserAccountView.scss";
import UserDashboardView from "./UserDashboardView/UserDashboardView";
import AuthenticationView from "./AuthenticationView/AuthenticationView";
import { useAppSelector } from "../../../redux/hooks";

export default function UserAccountView() {
  const username = useAppSelector((state) => state.user.username);
  return <div className="UserAccountView">{username ? <UserDashboardView /> : <AuthenticationView />}</div>;
}
