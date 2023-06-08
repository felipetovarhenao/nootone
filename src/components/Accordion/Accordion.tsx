import "./Accordion.scss";
import cn from "classnames";
import React, { ReactElement, ReactNode, useState } from "react";

type AccordionProps = {
  children: ReactNode;
  className?: string;
};

type AccordionItemProps = AccordionProps & {
  header: string | ReactNode;
  onClick?: () => void;
  isOpen?: boolean;
};

export const AccordionItem = ({ className, isOpen, onClick, header, children }: AccordionItemProps) => {
  return (
    <div className={cn(className, "AccordionItem", { "--is-open": isOpen })}>
      <h1 className="AcccordionItem__header" onClick={onClick}>
        {header}
      </h1>
      {isOpen && <div className="AcccordionItem__container">{children}</div>}
    </div>
  );
};

const Accordion = ({ className, children }: AccordionProps) => {
  const [openItem, setOpenItem] = useState<number | null>(0);
  const makeAccordionItems = () => {
    return React.Children.map(children as any, (child: ReactElement, i: number) => {
      return React.createElement(AccordionItem, {
        ...child.props,
        onClick: () => {
          setOpenItem(i);
        },
        isOpen: i === openItem,
      });
    });
  };
  return <div className={cn(className, "Accordion")}>{makeAccordionItems()}</div>;
};

export default Accordion;
