import "./HamburgerDropdown.scss";
import React, { HTMLAttributes, useState } from "react";
import Icon from "../Icon/Icon";
import { RefLink, scrollToSection } from "../AnchorNavbar/AnchorNavbar";

interface HamburgerDropdownProps extends HTMLAttributes<HTMLDivElement> {
  links: RefLink[];
}

const HamburgerDropdown: React.FC<HamburgerDropdownProps> = ({ links, ...rest }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="HamburgerDropdown" {...rest}>
      <Icon icon="mdi:hamburger-menu" onClick={() => setIsOpen((x) => !x)} />
      {isOpen && (
        <div className="menu-items">
          {links.map((link) => (
            <div
              className="navbar-link"
              key={link.label}
              onClick={() => {
                scrollToSection(link.ref);
                setIsOpen(false);
              }}
            >
              {link.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HamburgerDropdown;
