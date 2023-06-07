import "./MostRecentTracksView.scss";
import RecordingLayout from "../../../../layouts/RecordingLayout/RecordingLayout";
import { useAppSelector } from "../../../../redux/hooks";

const MostRecentTracksView = () => {
  const { saved: savedRecordings } = useAppSelector((state) => state.recordings);

  return (
    <div className="MostRecentTracksView">
      {savedRecordings.length > 0 && (
        <>
          <h1 className="TracksView__header">unsaved drafts</h1>
          {[...savedRecordings]
            .sort((a, b) => b.date?.localeCompare(a.date || "0"))
            .map((rec, i) => (
              <RecordingLayout saved={true} key={i} rec={rec} />
            ))}
          <hr />
        </>
      )}
    </div>
  );
};

export default MostRecentTracksView;
