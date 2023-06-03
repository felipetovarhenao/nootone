import "./Avatar.scss";
import BoringAvatar from "boring-avatars";
import cn from "classnames";

type AvatarProps = {
  username: string;
  className?: string;
  size?: number;
  onClick?: () => void;
};

const style = getComputedStyle(document.body);

const colors = ["--primary-4", "--primary-2", "--primary-1", "--primary-3", "--secondary-5"];

const Avatar = ({ username, size, className, onClick }: AvatarProps) => {
  return (
    <div onClick={onClick} className={cn(className, "Avatar")}>
      <BoringAvatar size={size || "100%"} name={username} variant="beam" colors={colors.map((c) => style.getPropertyValue(c))} />
    </div>
  );
};

export default Avatar;
