import cn from "classnames";
import "./ImageWrapper.scss";

type ImageWrapperProps = {
  src: string;
  alt?: string;
  className?: string;
};
const ImageWrapper = ({ src, alt, className }: ImageWrapperProps) => {
  return (
    <div className={cn(className, "ImageWrapper")}>
      <img className="ImageWrapper__inner" src={src} alt={alt} />
    </div>
  );
};

export default ImageWrapper;
