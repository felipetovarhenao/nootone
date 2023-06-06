import cn from "classnames";
import Avatar from "../../../../components/Avatar/Avatar";
import Button from "../../../../components/Button/Button";
import Hr from "../../../../components/Hr/Hr";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { logout } from "../../../../redux/userSlice";
import "./UserDashboardView.scss";
import { useNotification } from "../../../../components/Notification/NotificationProvider";
import Switch from "../../../../components/Switch/Switch";
import { useDarkTheme } from "../../../../hooks/useDarkTheme";

const UserDashboardView = () => {
  const { username, plan, loading } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const notification = useNotification();
  const { toggleDarkTheme } = useDarkTheme();
  return (
    <div className="UserDashboardView">
      <div className="UserDashboardView__header">
        <Avatar className="UserDashboardView__header__avatar" size={60} username={username} />
        <div className="UserDashboardView__header__text">
          <h1 className="UserDashboardView__header__text__username">{username}</h1>
          <h2 className="UserDashboardView__header__text__plan">{plan}</h2>
        </div>
      </div>
      <Hr />
      <div className="UserDashboardView__sections">
        {Object.keys(accountMenu).map((section, i) => (
          <div key={i} className="UserDashboardView__sections__section">
            <h1 className="UserDashboardView__sections__section__header">{section}</h1>
            <div className="UserDashboardView__sections__section__options">
              {accountMenu[section].map((option, j) => (
                <div className={cn("UserDashboardView__sections__section__options__option", { "--danger": option.danger })} key={j}>
                  {option.label}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Switch className="UserDashboardView__theme-switch" onSwitch={() => toggleDarkTheme()} offIcon="ic:sharp-dark-mode" onIcon="entypo:light-up" />
      <Button
        className="UserDashboardView__logout-btn"
        color="danger"
        disabled={loading}
        onClick={async () => {
          await dispatch(logout());
          notification({
            type: "ERROR",
            icon: "mdi:user",
            message: "logout successful!",
          });
        }}
      >
        log out
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

const accountMenu: { [section: string]: AccountMenuOption[] } = {
  account: [
    {
      label: "Subscription plan",
      onClick: () => {},
    },
  ],
  "tech support": [
    {
      label: "Report a problem",
      onClick: () => {},
    },
  ],
  security: [
    {
      label: "Change password",
      onClick: () => {},
    },
    {
      label: "Delete account",
      onClick: () => {},
      danger: true,
    },
  ],
  appearance: [],
};
