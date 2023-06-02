import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../Icon/Icon";
import cn from "classnames";
import "./MobileNavbar.scss";

interface MobileNavbarProps {
  className?: string;
  defaultSelection?: number;
  links: {
    icon: string;
    path: string;
  }[];
}

const MobileNavbar: React.FC<MobileNavbarProps> = ({ links, className, defaultSelection }) => {
  const [selected, setSelected] = useState(-1);
  const navigate = useNavigate();
  useEffect(() => {
    if (defaultSelection) {
      setSelected(defaultSelection);
      navigate(links[defaultSelection].path);
    }
  }, []);

  return (
    <nav className={cn(className, "MobileNavbar")}>
      <ul className="links">
        {links.map((link, index) => (
          <li
            className="link"
            key={index}
            onClick={() => {
              setSelected(index);
              navigate(link.path);
            }}
          >
            <Icon className={cn("icon", { "--selected": selected === index })} icon={link.icon} />
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MobileNavbar;
