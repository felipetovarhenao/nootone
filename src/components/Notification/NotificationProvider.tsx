import { createContext, useContext, useReducer, ReactNode } from "react";
import { createPortal } from "react-dom";
import { v4 as uuidv4 } from "uuid";
import Notification, { NotificationMessageType } from "./Notification";

interface NotificationState {
  id: string;
  type: NotificationMessageType;
  icon: any;
  message: string;
}

type NotificationAction = { type: "ADD_NOTIFICATION"; payload: NotificationState } | { type: "REMOVE_NOTIFICATION"; id: string };

type Dispatch = (action: NotificationAction) => void;

const NotificationContext = createContext<Dispatch | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export default function NotificationProvider(props: NotificationProviderProps) {
  const [state, dispatch] = useReducer((state: NotificationState[], action: NotificationAction) => {
    switch (action.type) {
      case "ADD_NOTIFICATION":
        return [...state, { ...action.payload }];
      case "REMOVE_NOTIFICATION":
        return state.filter((el) => el.id !== action.id);
      default:
        return state;
    }
  }, []);

  return (
    <NotificationContext.Provider value={dispatch}>
      {createPortal(
        state.map((note) => {
          return <Notification dispatch={dispatch} key={note.id} {...note} />;
        }),
        document.getElementById("notifications") as HTMLElement
      )}
      {props.children}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => {
  const dispatch = useContext(NotificationContext);

  return (props: Omit<NotificationState, "id">) => {
    dispatch!({
      type: "ADD_NOTIFICATION",
      payload: {
        id: uuidv4(),
        ...props,
      },
    });
  };
};
