import "./PlaygroundView.scss";
import Icon from "../../../components/Icon/Icon";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../redux/hooks";
import AudioPlayer from "../../../components/AudioPlayer/AudioPlayer";

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
          <h1>unsaved</h1>
          {unsavedRecordings.map((rec, i) => (
            // <audio key={i} controls src={rec.url} />
            <AudioPlayer title={rec.name} key={i} src={rec.url} />
          ))}
          <hr />
        </>
      )}
      {savedRecordings.length > 0 && (
        <>
          <h1>saved</h1>
          {savedRecordings.map((rec, i) => (
            <audio key={i} controls src={rec.url} />
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
