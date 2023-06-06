import "./MostRecentTracksView.scss";
import Hr from "../../../../components/Hr/Hr";
import RecordingLayout from "../../../../layouts/RecordingLayout/RecordingLayout";
import { useAppSelector } from "../../../../redux/hooks";

const MostRecentTracksView = () => {
  const { saved: savedRecordings, unsaved: unsavedRecordings } = useAppSelector((state) => state.recordings);

  return (
    <div className="MostRecentTracksView">
      {unsavedRecordings.length > 0 && (
        <>
          <h1 className="TracksView__header">unsaved drafts</h1>
          {[...unsavedRecordings]
            .sort((a, b) => b.date?.localeCompare(a.date || "0"))
            .map((rec, i) => (
              <RecordingLayout key={i} rec={rec} />
            ))}
          <hr />
        </>
      )}
      {savedRecordings.length > 0 && unsavedRecordings.length > 0 && <Hr />}
      {savedRecordings.length > 0 && (
        <>
          <h1 className="TracksView__header">my ideas</h1>
          {[...savedRecordings]
            .sort((a, b) => b.date?.localeCompare(a.date || "0"))
            .map((rec, i) => (
              <RecordingLayout saved={true} key={i} rec={rec} />
            ))}
        </>
      )}
    </div>
  );
};

export default MostRecentTracksView;
