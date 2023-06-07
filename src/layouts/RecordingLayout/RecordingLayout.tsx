import "./RecordingLayout.scss";
import { useAppDispatch } from "../../redux/hooks";
import { recordingActions } from "../../redux/recordings/recordingsSlice";
import AudioPlayer from "../../components/AudioPlayer/AudioPlayer";
import Icon from "../../components/Icon/Icon";
import Dropdown from "../../components/Dropdown/Dropdown";
import icons from "../../utils/icons";
import { Recording } from "../../types/audio";

const RecordingLayout = ({ rec }: { saved?: boolean; rec: Recording }) => {
  const dispatch = useAppDispatch();
  const processingOptions: ProcessingOption[] = [
    // {
    //   name: "retune it",
    //   icon: "fluent:wand-16-filled",
    //   onClick: () => {},
    // },
    {
      name: "add accompaniment",
      icon: "emojione-monotone:musical-notes",
      onClick: () => {
        dispatch(recordingActions.harmonize(rec));
      },
    },
    // {
    //   name: "drumify it",
    //   icon: "fa6-solid:drum",
    //   onClick: () => {},
    // },
  ];
  console.log(rec);
  return (
    <div className="RecordingLayout">
      <div className="RecordingLayout__options">
        {false && (
          <Icon
            className="RecordingLayout__options__option"
            id="check"
            icon={icons.check}
            onClick={() => {
              dispatch(recordingActions.write(rec));
            }}
          />
        )}
        <Icon
          className="RecordingLayout__options__option"
          id="trash"
          icon={icons.trash}
          onClick={() => {
            dispatch(recordingActions.discard(rec));
          }}
        />
      </div>

      <AudioPlayer className="RecordingLayout__player" rec={rec} />
      <Dropdown legendOpen="hide options" legendClosed="show options">
        <div className="RecordingLayout__operations">
          {processingOptions.map((opt) => (
            <div className="RecordingLayout__operations__operation" key={opt.name} onClick={opt.onClick}>
              <Icon className="RecordingLayout__operations__operation__icon" icon={opt.icon} />
              <span className="RecordingLayout__operations__operation__text">{opt.name}</span>
            </div>
          ))}
        </div>
      </Dropdown>
      {rec.variations?.length > 0 && (
        <Dropdown legendClosed="show variations" legendOpen="hide variations">
          {rec.variations?.map((variation, i) => (
            <AudioPlayer key={i} rec={variation} />
          ))}
        </Dropdown>
      )}
    </div>
  );
};

type ProcessingOption = {
  icon: string;
  name: string;
  onClick: (rec: any) => void;
};

export default RecordingLayout;
