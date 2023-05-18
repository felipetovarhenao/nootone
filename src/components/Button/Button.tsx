import "./Button.scss";
import cn from "classnames";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: "primary" | "secondary" | "danger" | "caution" | "neutral";
}

export default function Button({ color = "primary", children, className, ...rest }: ButtonProps) {
  return (
    <button className={cn(className, "Button", color)} {...rest}>
      {children}
    </button>
  );
}
