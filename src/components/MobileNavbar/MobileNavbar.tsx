import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../Icon/Icon";
import cn from "classnames";
import "./MobileNavbar.scss";
import { useAppSelector } from "../../redux/hooks";

interface MobileNavbarProps {
  className?: string;
  selected?: number;
  links: {
    icon: string;
    path: string;
  }[];
}

const MobileNavbar: React.FC<MobileNavbarProps> = ({ links, className, selected }) => {
  const navigate = useNavigate();
  const isRecording = useAppSelector((state) => state.mic.isRecording);

  return (
    <nav className={cn(className, "MobileNavbar")}>
      <ul className="links">
        {links.map((link, index) => (
          <li
            className={cn("link", { "--selected": selected === index })}
            key={link.icon}
            onClick={() => {
              if (!isRecording) {
                navigate(link.path);
              }
            }}
          >
            <div className="line" />
            <Icon className="icon" icon={link.icon} />
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MobileNavbar;
