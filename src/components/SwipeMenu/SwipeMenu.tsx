import "./SwipeMenu.scss";
import React, { ReactElement, ReactNode, useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import Icon from "../Icon/Icon";
import icons from "../../utils/icons";
import cn from "classnames";

type SwipeMenuProps = {
  children: ReactNode;
  className?: string;
  onSwiped?: (i: number) => void;
};

const SwipeMenu = ({ className, children, onSwiped }: SwipeMenuProps) => {
  const [selected, setSelected] = useState(0);

  function handleSwipe(num: number) {
    setSelected((x) => wrapValue(x - num, React.Children.count(children)));
  }
  const handlers = useSwipeable({
    onSwiped: (e) => {
      handleSwipe(e.dir === "Left" ? -1 : 1);
    },
    trackTouch: true,
    trackMouse: true,
  });

  useEffect(() => {
    if (onSwiped) {
      onSwiped(selected);
    }
  }, [selected]);
  const showSelected = () => {
    return React.Children.map(children as any, (child: ReactElement, i: number) => {
      if (selected === i) {
        return child;
      }
    });
  };

  return (
    <div className={cn(className, "SwipeMenu")} {...handlers}>
      <Icon className="SwipeMenu__button" icon={icons.left} onClick={() => handleSwipe(-1)} />
      {showSelected()}
      <Icon className="SwipeMenu__button" icon={icons.right} onClick={() => handleSwipe(1)} />
    </div>
  );
};

export default SwipeMenu;

function wrapValue(x: number, N: number) {
  const y = x % N;
  return y < 0 ? N + y : y;
}
