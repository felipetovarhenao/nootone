import cn from "classnames";
import "./Hr.scss";

type HrProps = {
  className?: string;
};
const Hr = ({ className }: HrProps) => {
  return <hr className={cn(className, "Hr")} />;
};

export default Hr;
