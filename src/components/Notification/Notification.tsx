import classNames from "classnames";
import { useCallback, /*  useContext, */ useEffect, useState } from "react";
import "./Notification.scss";
import Icon from "../Icon/Icon";
import { useDarkTheme } from "../../hooks/useDarkTheme";
// import { ThemeContext } from "../../utils/contexts";

export type NotificationMessageType = "SUCCESS" | "DANGER" | "CAUTION";

interface NotificationProps {
  dispatch: Function;
  id: number | string;
  type: NotificationMessageType;
  icon: any;
  message: string;
}

export default function Notification(props: NotificationProps) {
  const [exit, setExit] = useState<boolean>(false);
  const [width, setWidth] = useState<number>(0);
  const [intervalID, setIntervalID] = useState<NodeJS.Timeout | null>(null);
  const { darkTheme } = useDarkTheme();

  const handleStartTimer = () => {
    const id = setInterval(() => {
      setWidth((prev) => {
        if (prev < 100) {
          return prev + 0.33;
        }
        clearInterval(id);
        return prev;
      });
    }, 20);
    setIntervalID(id);
  };

  const handlePauseTimer = useCallback(() => {
    if (intervalID) {
      clearInterval(intervalID);
    }
  }, [intervalID]);

  const handleCloseNotification = useCallback(() => {
    handlePauseTimer();
    setExit(true);
    setTimeout(() => {
      props.dispatch({
        type: "REMOVE_NOTIFICATION",
        id: props.id,
      });
    }, 1000);
  }, [handlePauseTimer, props]);

  useEffect(() => {
    if (width >= 100) {
      handleCloseNotification();
    }
  }, [width, handleCloseNotification]);

  useEffect(() => {
    handleStartTimer();
  }, []);

  return (
    <div className={classNames("Notification", props.type.toLowerCase(), { exit: exit }, { dark: darkTheme })}>
      <div className="Notification__message">
        <Icon className="Notification__message__icon" icon={props.icon} />
        <span className="Notification__message__text">{props.message}</span>
        <Icon className="Notification__message__close" icon="material-symbols:close" onClick={handleCloseNotification} />
      </div>
      <div className={"Notification__bar"} style={{ width: `${width}%` }} />
    </div>
  );
}
