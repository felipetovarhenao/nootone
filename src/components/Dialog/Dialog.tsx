import "./Dialog.scss";
import { useState, useRef, useEffect, createContext, ReactNode, useContext } from "react";
import Button from "../Button/Button";
import { createPortal } from "react-dom";
import cn from "classnames";
import { useDarkTheme } from "../../hooks/useDarkTheme";

const DialogContext = createContext<DialogContextType | undefined>(undefined);

type DialogButtonType = "success" | "danger" | "neutral";

export const DialogProvider = ({ children }: DialogProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [dialogProps, setDialogProps] = useState<DialogProps | undefined>();
  const { darkTheme } = useDarkTheme();

  useEffect(() => {
    const dialog = dialogRef.current;

    if (dialog) {
      if (isOpen) {
        dialog.showModal();
      } else {
        dialog.close();
      }
    }
  }, [isOpen]);

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  const updateDialog = (props: DialogProps) => {
    openDialog();
    setDialogProps(props);
  };

  return (
    <DialogContext.Provider value={updateDialog}>
      {children}
      {createPortal(
        <dialog className={cn({ dark: darkTheme }, { "--open": isOpen }, "Dialog")} ref={dialogRef}>
          <div className="Dialog__container">
            <div className="Dialog__container__text">
              <h1 className="Dialog__container__header">{dialogProps?.header}</h1>
              <p className="Dialog__container__message">{dialogProps?.message}</p>
            </div>
            <div className="Dialog__container__buttons">
              {dialogProps?.buttons.map((btn) => (
                <Button
                  className={cn({ [`--${btn.type}`]: btn.type }, "Dialog__container__buttons__button")}
                  key={btn.label}
                  onClick={() => btn.onClick(closeDialog)}
                >
                  {btn.label}
                </Button>
              ))}
            </div>
          </div>
        </dialog>,
        document.getElementById("dialog") as HTMLElement
      )}
    </DialogContext.Provider>
  );
};

const useDialog = () => {
  return useContext(DialogContext)!;
};

export default useDialog;

type DialogProviderProps = {
  children: ReactNode;
};

type DialogButton = {
  icon: string;
  label: string;
  type?: DialogButtonType;
  onClick: (closeDialog: () => void) => void;
};
export type DialogProps = {
  header: string;
  message: string;
  buttons: DialogButton[];
};

type DialogContextType = (props: DialogProps) => void;
