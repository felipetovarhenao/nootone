import "./ToggleBar.scss";
import { useState } from "react";
import Icon from "../Icon/Icon";
import { IconProps } from "@iconify/react";
import cn from "classnames";

interface ToggleProps extends IconProps {
  name: string;
  onClick: React.MouseEventHandler<HTMLDivElement | SVGElement>;
  isSelected?: boolean;
}

export interface ToggleBarProps extends React.PropsWithChildren {
  toggles: ToggleProps[];
  defaultSelected?: number;
}

export default function ToggleBar({ toggles, defaultSelected = 0, children, ...rest }: ToggleBarProps) {
  const [selected, setSelected] = useState(defaultSelected);

  return (
    <div className="toggle-bar" {...rest}>
      {children}
      {toggles.map((tgl, i) => (
        <Toggle
          key={i}
          name={tgl.name}
          isSelected={selected === i}
          onClick={(e) => {
            setSelected(i);
            tgl.onClick(e);
          }}
          icon={tgl.icon}
        />
      ))}
    </div>
  );
}

function Toggle({ name, isSelected, onClick, ...rest }: ToggleProps) {
  return (
    <div onClick={onClick} className={cn({ selected: isSelected }, "toggle-container")}>
      <Icon className="toggle" {...rest} />
      <div className="toggle-name">{name}</div>
    </div>
  );
}
