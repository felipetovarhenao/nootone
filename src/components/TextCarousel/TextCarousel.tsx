import React, { ReactElement, ReactNode, useEffect, useState } from "react";
import "./TextCarousel.scss";
import wrapValue from "../../utils/wrapValue";
import cn from "classnames";

type TextCarouselProps = {
  children: ReactNode;
  className?: string;
  duration?: number;
  repetitions?: number;
};

const TextCarousel = ({ children, className, duration = 2, repetitions }: TextCarouselProps) => {
  const [selected, setSelected] = useState(0);
  const rotateChildren = () => {
    return React.Children.map(children as any, (child: ReactElement, i: number) => {
      if (selected === i) {
        const neighbor = Array.isArray(children) && children[wrapValue(i + 1, React.Children.count(children))];
        const style = {
          animationDuration: `${duration}s`,
          animationIterationCount: repetitions ? repetitions : "infinite",
        };
        return (
          <>
            {React.cloneElement(child, {
              ...child.props,
              className: cn("TextCarousel__current", child.props.className),
              style: style,
            })}
            {neighbor &&
              React.cloneElement(neighbor, {
                ...neighbor.props,
                className: cn("TextCarousel__next", neighbor.props.className),
                style: style,
              })}
          </>
        );
      }
    });
  };
  useEffect(() => {
    const handler = setInterval(() => {
      setSelected((x) => wrapValue(x + 1, React.Children.count(children)));
    }, duration * 1000);
    return () => {
      clearInterval(handler);
    };
  }, []);
  return <div className={cn(className, "TextCarousel")}>{rotateChildren()}</div>;
};

export default TextCarousel;
