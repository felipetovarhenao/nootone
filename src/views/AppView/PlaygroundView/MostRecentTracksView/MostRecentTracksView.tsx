import "./MostRecentTracksView.scss";
import RecordingLayout from "../../../../layouts/RecordingLayout/RecordingLayout";
import { useAppSelector } from "../../../../redux/hooks";
import Icon from "../../../../components/Icon/Icon";

const MostRecentTracksView = () => {
  const { saved: savedRecordings, isProcessing } = useAppSelector((state) => state.recordings);

  return (
    <div className="MostRecentTracksView">
      {isProcessing ? (
        <div className="MostRecentTracksView__processing">
          <Icon className="MostRecentTracksView__processing__spinner" icon="eos-icons:bubble-loading" />
          <span className="MostRecentTracksView__processing__text">processing</span>
        </div>
      ) : (
        savedRecordings.length > 0 && (
          <>
            <h1 className="TracksView__header">unsaved drafts</h1>
            {[...savedRecordings]
              .sort((a, b) => b.date?.localeCompare(a.date || "0"))
              .map((rec, i) => (
                <RecordingLayout saved={true} key={i} rec={rec} />
              ))}
            <hr />
          </>
        )
      )}
    </div>
  );
};

export default MostRecentTracksView;
