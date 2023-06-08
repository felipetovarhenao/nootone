import "./MostRecentTracksView.scss";
import RecordingLayout from "../../../../layouts/RecordingLayout/RecordingLayout";
import { useAppSelector } from "../../../../redux/hooks";

const MostRecentTracksView = () => {
  const { recordings } = useAppSelector((state) => state.recordings);

  return (
    <div className="MostRecentTracksView">
      <h1 className="TracksView__header">unsaved drafts</h1>
      {[...recordings]
        .sort((a, b) => b.date?.localeCompare(a.date || "0"))
        .map((rec, i) => (
          <RecordingLayout key={i} rec={rec} recIndex={i} />
        ))}
      <hr />
    </div>
  );
};

export default MostRecentTracksView;
