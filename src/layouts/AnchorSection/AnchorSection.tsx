import "./AnchorSection.scss";
import { HTMLAttributes, ReactNode, forwardRef, Ref } from "react";
import cn from "classnames";

export interface AnchorSectionProps extends HTMLAttributes<HTMLDivElement> {
  header: string;
  children: ReactNode;
}

const AnchorSection = forwardRef<HTMLDivElement, AnchorSectionProps>(function AnchorSection(
  { header, children, className, ...rest }: AnchorSectionProps,
  ref: Ref<HTMLDivElement>
) {
  return (
    <div className={cn(className, "AnchorSection")} ref={ref} {...rest}>
      <h1 className="header">{header}</h1>
      <div className="body">{children}</div>
    </div>
  );
});

export default AnchorSection;
