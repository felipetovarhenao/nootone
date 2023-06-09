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
import downloadURL from "../../utils/downloadURL";

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
        <div className="RecordingLayout__icons">
          <Icon className="RecordingLayout__icons__icon" icon={icons.download} onClick={() => downloadURL(rec.url)} />
          <Icon
            id="edit"
            className="RecordingLayout__icons__icon"
            icon={icons.edit}
            onClick={() => {
              dispatch(recordingActions.selectRecording(recIndex));
              navigate(`/app/playground/recordings/${recIndex}/edit`);
            }}
          />
        </div>
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
