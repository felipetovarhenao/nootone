import BoringAvatar from "boring-avatars";
import cn from "classnames";

type AvatarProps = {
  username: string;
  className?: string;
  onClick?: () => void;
};

const style = getComputedStyle(document.body);

const colors = ["--primary-1", "--primary-2", "--primary-3", "--primary-4", "--secondary-3"];

const Avatar = ({ username, className, onClick }: AvatarProps) => {
  return (
    <div onClick={onClick} className={cn(className, "Avatar")}>
      <BoringAvatar size={"100%"} name={username} variant="beam" colors={colors.map((c) => style.getPropertyValue(c))} />
    </div>
  );
};

export default Avatar;
