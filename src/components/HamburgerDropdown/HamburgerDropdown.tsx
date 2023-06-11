import "./HamburgerDropdown.scss";
import React, { HTMLAttributes, ReactElement, ReactNode, useState } from "react";
import Icon from "../Icon/Icon";
import cn from "classnames";

interface HamburgerDropdownProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

const HamburgerDropdown: React.FC<HamburgerDropdownProps> = ({ className, children, ...rest }) => {
  const [isOpen, setIsOpen] = useState(false);

  function renderChildren() {
    return React.Children.map(children as any, (child: ReactElement) => {
      return React.cloneElement(child, {
        ...child.props,
        onClick: () => {
          if (child.props?.onClick) {
            child.props.onClick();
          }
          setIsOpen(false);
        },
      });
    });
  }

  return (
    <div className="HamburgerDropdown" {...rest}>
      <Icon icon="mdi:hamburger-menu" onClick={() => setIsOpen((x) => !x)} />
      {isOpen && (
        <>
          <div className={cn(className, "HamburgerDropdown__children")}>{renderChildren()}</div>
          <div className="HamburgerDropdown__bg-layer" onClick={() => setIsOpen(false)} />
        </>
      )}
    </div>
  );
};

export default HamburgerDropdown;
