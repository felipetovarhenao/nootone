import "./Switch.scss";
import { HTMLAttributes, useState } from "react";
import classNames from "classnames";
import Icon from "../Icon/Icon";

export interface SwitchProps extends HTMLAttributes<HTMLDivElement> {
  onSwitch: (state: boolean) => void;
  defaultState?: boolean;
  onIcon?: string;
  offIcon?: string;
}

export default function Switch({ className, defaultState = false, onSwitch, offIcon, onIcon, ...rest }: SwitchProps) {
  const [isActive, setIsActive] = useState(defaultState);
  return (
    <div
      className={classNames(className, "switch", { active: isActive })}
      onClick={() => {
        setIsActive((x) => !x);
        onSwitch(!isActive);
      }}
      {...rest}
    >
      {onIcon && <Icon className="on-icon" icon={onIcon} />}
      <div className="pin-outer">
        <div className="pin-inner" style={isActive ? { marginLeft: "50%", marginRight: "0%" } : { marginRight: "50%", marginLeft: "0%" }} />
      </div>
      {offIcon && <Icon className="off-icon" icon={offIcon} />}
    </div>
  );
}
