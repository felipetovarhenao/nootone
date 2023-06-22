import "./BigSettingLayout.scss";
import cn from "classnames";
import { ReactNode } from "react";
import { useSwipeable } from "react-swipeable";

type BigSettingLayoutProps = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  onSwipedUp?: () => void;
  onSwipedDown?: () => void;
  unit?: string;
  label: string;
  disabled?: boolean;
};

const BigSettingLayout = ({ onSwipedDown, onSwipedUp, children, unit = "", className, label, onClick, disabled = false }: BigSettingLayoutProps) => {
  const handlers = useSwipeable({
    onSwipedUp: () => {
      if (!disabled && onSwipedUp) {
        onSwipedUp();
      }
    },
    onSwipedDown: () => {
      if (!disabled && onSwipedDown) {
        onSwipedDown();
      }
    },
    trackTouch: true,
    trackMouse: true,
  });

  return (
    <div className={cn(className, "BigSettingLayout")}>
      <div
        onClick={() => {
          if (disabled || !onClick) {
            return;
          }
          onClick();
        }}
        className="BigSettingLayout__value"
        {...handlers}
      >
        {children}
        <span className="BigSettingLayout__value__unit">{unit}</span>
      </div>
      <span className="BigSettingLayout__text">{label}</span>
    </div>
  );
};

export default BigSettingLayout;
