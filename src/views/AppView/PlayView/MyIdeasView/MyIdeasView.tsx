import "./MyIdeasView.scss";
import RecordingLayout from "../../../../layouts/RecordingLayout/RecordingLayout";
import { useAppSelector } from "../../../../redux/hooks";

const MyIdeasView = () => {
  const { recordings } = useAppSelector((state) => state.recordings);

  return (
    <div className="MyIdeasView">
      <h1 className="TracksView__header">my sketches ({recordings.length})</h1>
      <div className="TracksView__recordings">
        {[...recordings]
          .sort((a, b) => b.date?.localeCompare(a.date || "0"))
          .map((rec, i) => (
            <RecordingLayout className="MyIdeasView__recordings__recording" key={rec.name} rec={rec} recIndex={i} />
          ))}
      </div>
    </div>
  );
};

export default MyIdeasView;
