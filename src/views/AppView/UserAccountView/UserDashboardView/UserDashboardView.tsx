import Button from "../../../../components/Button/Button";
import Hr from "../../../../components/Hr/Hr";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { logout } from "../../../../redux/userSlice";
import "./UserDashboardView.scss";

const UserDashboardView = () => {
  const { username, loading } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  return (
    <div className="UserDashboardView">
      <h1 className="UserDashboardView__header">
        👋, <span className="UserDashboardView__header__username">{username}</span> !
      </h1>
      <Hr />
      <div className="UserDashboardView__options">
        {accountMenu.map((option, i) => (
          <div className="UserDashboardView__options__option" key={i} onClick={option.onClick}>
            {option.label}
          </div>
        ))}
      </div>
      <Button className="UserDashboardView__logout-btn" color="danger" disabled={loading} onClick={() => dispatch(logout())}>
        logout
      </Button>
    </div>
  );
};

export default UserDashboardView;

type AccountMenuOption = {
  label: string;
  danger?: boolean;
  onClick: () => void;
};

const accountMenu: AccountMenuOption[] = [
  {
    label: "Subscription plan",
    onClick: () => {},
  },
  {
    label: "Change password",
    onClick: () => {},
  },
  {
    label: "Delete account",
    onClick: () => {},
    danger: true,
  },
];
