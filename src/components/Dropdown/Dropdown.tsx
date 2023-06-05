import "./Dropdown.scss";
import { useState, ReactNode } from "react";
import { Icon } from "@iconify/react";
import classNames from "classnames";

interface DropdownProps {
  children: ReactNode;
  legendOpen?: string;
  legendClosed?: string;
  className?: string;
  openByDefault?: boolean;
}

export default function Dropdown({ children, legendOpen = "close", legendClosed = "open", className, openByDefault }: DropdownProps) {
  const [open, setOpen] = useState(openByDefault || false);

  return (
    <div className={classNames("dropdown", className || "")}>
      <div className="btn" onClick={() => setOpen((x) => !x)}>
        <Icon icon={open ? "material-symbols:keyboard-arrow-down" : "material-symbols:keyboard-arrow-right"} className="btn-icon" />
        <span className="btn-txt">{open ? legendOpen : legendClosed}</span>
      </div>
      <div className={classNames({ open }, "content")}>{children}</div>
    </div>
  );
}
