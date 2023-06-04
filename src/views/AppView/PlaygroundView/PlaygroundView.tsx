import "./PlaygroundView.scss";
import Icon from "../../../components/Icon/Icon";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import AudioPlayer from "../../../components/AudioPlayer/AudioPlayer";
import Hr from "../../../components/Hr/Hr";
import icons from "../../../utils/icons";
import { discard, erase, Recording, write } from "../../../redux/recordingsSlice";

export default function PlaygroundView() {
  const { saved: savedRecordings, unsaved: unsavedRecordings } = useAppSelector((state) => state.recordings);
  return <div className="PlaygroundView">{savedRecordings.length === 0 && unsavedRecordings.length === 0 ? <NoTracksView /> : <TracksView />}</div>;
}

const TracksView = () => {
  const { saved: savedRecordings, unsaved: unsavedRecordings } = useAppSelector((state) => state.recordings);

  return (
    <div className="TracksView">
      {unsavedRecordings.length > 0 && (
        <>
          <h1 className="TracksView__header">pending review</h1>
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

const NoTracksView = () => {
  const navigate = useNavigate();
  return (
    <div className="NoTracksView">
      <Icon className="NoTracksView__icon" icon="academicons:ideas-repec" />
      <div className="NoTracksView__text">
        <p>Looks like you haven't recorded anything yet!</p>
        <p>
          To start,{" "}
          <span className="NoTracksView__text__link" onClick={() => navigate("/app/")}>
            record an idea
          </span>
          <Icon className="NoTracksView__text__icon" icon="fluent:music-note-1-20-filled" />
        </p>
      </div>
    </div>
  );
};

const RecordingLayout = ({ saved = false, rec }: { saved?: boolean; rec: Recording }) => {
  const dispatch = useAppDispatch();
  return (
    <div className="RecordingLayout">
      <div className="RecordingLayout__options">
        {!saved && (
          <Icon
            className="RecordingLayout__options__option"
            id="check"
            icon={icons.check}
            onClick={() => {
              dispatch(write(rec));
            }}
          />
        )}
        <Icon
          className="RecordingLayout__options__option"
          id="trash"
          icon={icons.trash}
          onClick={() => {
            if (saved) {
              dispatch(erase(rec));
            } else {
              dispatch(discard(rec));
            }
          }}
        />
      </div>

      <AudioPlayer className="RecordingLayout__player" title={rec.name} src={rec.url} />
    </div>
  );
};
