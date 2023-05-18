import "./Icon.scss";
import { Icon as Iconify, IconProps } from "@iconify/react";
import cn from "classnames";

export default function Icon({ className, ...rest }: IconProps) {
  return <Iconify className={cn(className, "Icon")} {...rest} />;
}
