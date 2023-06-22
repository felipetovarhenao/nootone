import "./ViewContainer.scss";
import cn from "classnames";
import Icon from "../Icon/Icon";
import icons from "../../utils/icons";
import { useNavigate } from "react-router-dom";
import { ReactNode } from "react";

type ViewContainerProps = {
  className?: string;
  viewName: string | ReactNode;
  children: ReactNode;
  onGoBack?: () => void;
};
const ViewContainer = ({ onGoBack, className, viewName, children }: ViewContainerProps) => {
  const navigate = useNavigate();
  return (
    <div className={"ViewContainer"}>
      <div className="ViewContainer__header">
        <Icon
          className="ViewContainer__header__back-button"
          onClick={() => {
            if (onGoBack) {
              onGoBack();
            } else {
              navigate(-1);
            }
          }}
          icon={icons.back}
        />
        <header className="ViewContainer__header__text">{viewName}</header>
        <div></div>
      </div>
      <div className={cn(className, "ViewContainer__children")}>{children}</div>
    </div>
  );
};

export default ViewContainer;
