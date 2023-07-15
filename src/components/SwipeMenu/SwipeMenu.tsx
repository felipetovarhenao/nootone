import "./SwipeMenu.scss";
import React, { ReactElement, ReactNode, useEffect, useRef, useState } from "react";
import { useSwipeable } from "react-swipeable";
import Icon from "../Icon/Icon";
import icons from "../../utils/icons";
import cn from "classnames";
import wrapValue from "../../utils/wrapValue";

type SwipeMenuProps = {
  children: ReactNode;
  className?: string;
  defaultValue?: number;
  onSwiped?: (i: number) => void;
};

const SwipeMenu = ({ className, children, defaultValue = 0, onSwiped }: SwipeMenuProps) => {
  const [selected, setSelected] = useState(defaultValue);
  const directionRef = useRef<"LEFT" | "RIGHT" | "NEUTRAL">("NEUTRAL");

  function handleSwipe(num: number) {
    const newIndex = wrapValue(selected + num, React.Children.count(children));
    directionRef.current = num === 1 ? "LEFT" : "RIGHT";
    setSelected(newIndex);
    if (onSwiped) {
      onSwiped(newIndex);
    }
  }

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      handleSwipe(1);
    },
    onSwipedRight: () => {
      handleSwipe(-1);
    },
    trackTouch: true,
    trackMouse: true,
  });

  const showSelected = () => {
    return React.Children.map(children as any, (child: ReactElement, i: number) => {
      if (selected === i) {
        return React.cloneElement(child, {
          ...child.props,
          className: cn(child.props.className, `SwipeMenu__${directionRef.current.toLowerCase()}`),
        });
      }
    });
  };

  useEffect(() => {
    setSelected(defaultValue);
  }, [defaultValue]);

  return (
    <div className={cn(className, "SwipeMenu")} {...handlers}>
      <Icon className="SwipeMenu__button" icon={icons.left} onClick={() => handleSwipe(-1)} />
      {showSelected()}
      <Icon className="SwipeMenu__button" icon={icons.right} onClick={() => handleSwipe(1)} />
    </div>
  );
};

export default SwipeMenu;
