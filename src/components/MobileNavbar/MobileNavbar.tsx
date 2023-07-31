import React, { useState } from "react";
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
  const { isProcessing } = useAppSelector((state) => state.recordings);
  const [width, setWidth] = useState(selected ? 100 : 0);

  const handleStartTimer = () => {
    setWidth(10);
    const id = setInterval(() => {
      setWidth((prev) => {
        if (prev < 100) {
          return prev * 1.1;
        }
        clearInterval(id);
        return prev;
      });
    }, 15);

    return id;
  };

  return (
    <nav className={cn(className, "MobileNavbar")}>
      <ul className="links">
        {links.map((link, index) => (
          <li
            className={cn("link", { "--selected": selected === index })}
            key={link.icon}
            onClick={() => {
              if (!isRecording && !isProcessing) {
                navigate(link.path);
                handleStartTimer();
              }
            }}
          >
            <div style={selected === index ? { width: `${width}%` } : undefined} className="line" />
            <Icon className="icon" icon={link.icon} />
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MobileNavbar;
