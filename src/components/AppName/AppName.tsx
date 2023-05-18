import "./AppName.scss";
import cn from "classnames";

export default function AppName({ className }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <>
      <span className={cn(className, "AppName")} id="noo">
        noo
      </span>
      <span className={cn(className, "AppName")} id="tone">
        tone
      </span>
    </>
  );
}
