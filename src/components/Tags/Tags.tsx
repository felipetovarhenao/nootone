import "./Tags.scss";
import { Recording, RecordingVariation } from "../../types/audio";
import cn from "classnames";

type TagsProps = {
  rec: Recording | RecordingVariation;
  className?: string;
};

const Tags = ({ rec, className }: TagsProps) => {
  return (
    <div className={cn(className, "Tags")}>
      {rec.tags.map((tag, i) => (
        <span key={`${tag}-${i}`} className="Tags__tag">
          #{tag}
        </span>
      ))}
    </div>
  );
};

export default Tags;
