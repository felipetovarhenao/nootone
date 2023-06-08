import "./RecordingLayout.scss";
import { useAppDispatch } from "../../redux/hooks";
import { recordingActions } from "../../redux/recordings/recordingsSlice";
import AudioPlayer from "../../components/AudioPlayer/AudioPlayer";
import Icon from "../../components/Icon/Icon";
import Dropdown from "../../components/Dropdown/Dropdown";
import icons from "../../utils/icons";
import { Recording } from "../../types/audio";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";

const RecordingLayout = ({ rec, recIndex }: { rec: Recording; recIndex: number }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <div className="RecordingLayout">
      <AudioPlayer className="RecordingLayout__player" rec={rec} />
      <div className="RecordingLayout__buttons">
        <Button className="RecordingLayout__button" onClick={() => navigate(`/app/playground/recordings/${recIndex}`)}>
          <Icon className="icon" icon={icons.lab} />
          New variation
        </Button>
        <Button
          id="trash"
          className="RecordingLayout__button"
          onClick={() => {
            dispatch(recordingActions.discard(rec));
          }}
        >
          <Icon className="icon" icon={icons.trash} />
          Delete
        </Button>
      </div>
      {rec.variations?.length > 0 && (
        <Dropdown className="RecordingLayout__variations" openByDefault={true} legendClosed="show variations" legendOpen="hide variations">
          {rec.variations?.map((variation, i) => (
            <AudioPlayer className="RecordingLayout__variations__variation" key={i} rec={variation} />
          ))}
        </Dropdown>
      )}
    </div>
  );
};

export default RecordingLayout;
