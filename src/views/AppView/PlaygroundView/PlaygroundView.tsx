import "./PlaygroundView.scss";
import Icon from "../../../components/Icon/Icon";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import AudioPlayer from "../../../components/AudioPlayer/AudioPlayer";
import Hr from "../../../components/Hr/Hr";
import icons from "../../../utils/icons";
import { discard, erase, harmonizeRecording, Recording, write } from "../../../redux/recordingsSlice";
import Dropdown from "../../../components/Dropdown/Dropdown";

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

type ProcessingOption = {
  icon: string;
  name: string;
  onClick: (rec: any) => void;
};

const RecordingLayout = ({ saved = false, rec }: { saved?: boolean; rec: Recording }) => {
  const dispatch = useAppDispatch();
  const processingOptions: ProcessingOption[] = [
    {
      name: "retune it",
      icon: "fluent:wand-16-filled",
      onClick: () => {},
    },
    {
      name: "add accompaniment",
      icon: "emojione-monotone:musical-notes",
      onClick: (rec: any) => {
        dispatch(harmonizeRecording(rec));
      },
    },
    {
      name: "drumify it",
      icon: "fa6-solid:drum",
      onClick: () => {},
    },
  ];

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
      <Dropdown legendOpen="hide options" legendClosed="show options">
        <div className="RecordingLayout__operations">
          {processingOptions.map((opt) => (
            <div className="RecordingLayout__operations__operation" key={opt.name} onClick={() => opt.onClick(rec)}>
              <Icon className="RecordingLayout__operations__operation__icon" icon={opt.icon} />
              <span className="RecordingLayout__operations__operation__text">{opt.name}</span>
            </div>
          ))}
        </div>
      </Dropdown>
    </div>
  );
};
