import "./RecordingLayout.scss";
import { useAppDispatch } from "../../redux/hooks";
import { Recording, write, discard, erase, harmonizeRecording } from "../../redux/recordingsSlice";
import AudioPlayer from "../../components/AudioPlayer/AudioPlayer";
import Icon from "../../components/Icon/Icon";
import Dropdown from "../../components/Dropdown/Dropdown";
import icons from "../../utils/icons";

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

type ProcessingOption = {
  icon: string;
  name: string;
  onClick: (rec: any) => void;
};

export default RecordingLayout;
