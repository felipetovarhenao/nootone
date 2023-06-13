import "./HamburgerDropdown.scss";
import React, { HTMLAttributes, ReactElement, ReactNode, useEffect, useRef, useState } from "react";
import Icon from "../Icon/Icon";
import cn from "classnames";

interface HamburgerDropdownProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  component?: ReactNode;
}

const HamburgerDropdown: React.FC<HamburgerDropdownProps> = ({ component, className, children, ...rest }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (ref.current && !ref.current.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleClick() {
    setIsOpen((x) => !x);
  }

  return (
    <div className={cn(className, "HamburgerDropdown")} {...rest}>
      {component ? (
        <div className="handle" onClick={handleClick}>
          {component}
        </div>
      ) : (
        <Icon className="handle" icon="mdi:hamburger-menu" onClick={handleClick} />
      )}
      {isOpen && (
        <div ref={ref} className={"children"}>
          {renderChildren()}
        </div>
      )}
    </div>
  );
};

export default HamburgerDropdown;
