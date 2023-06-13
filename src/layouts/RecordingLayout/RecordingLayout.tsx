import "./RecordingLayout.scss";
import AudioPlayer from "../../components/AudioPlayer/AudioPlayer";
import Icon from "../../components/Icon/Icon";
import Dropdown from "../../components/Dropdown/Dropdown";
import icons from "../../utils/icons";
import { GenericRecording, Recording } from "../../types/audio";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AudioPlayerOptions from "../AudioPlayerOptions/AudioPlayerOptions";

const RecordingLayout = ({ rec, recIndex }: { rec: Recording; recIndex: number }) => {
  const navigate = useNavigate();
  const [globalVolume, setGlobalVolume] = useState(0.707);

  return (
    <div className="RecordingLayout">
      <div className="RecordingLayout__main-container">
        <span className="RecordingLayout__date">{rec.date}</span>
        <div className="RecordingLayout__player-container">
          <AudioPlayer onGainChange={setGlobalVolume} showGain={true} className="RecordingLayout__player" rec={rec} />
          <AudioPlayerOptions recording={rec} />
        </div>
      </div>
      <div className="RecordingLayout__buttons">
        <Button className="RecordingLayout__button" onClick={() => navigate(`/app/play/recordings/${recIndex}`)}>
          <Icon className="icon" icon={icons.waveform} />
          develop
        </Button>
      </div>
      {rec.variations?.length > 0 && (
        <Dropdown className="RecordingLayout__variations" openByDefault={true} legendClosed="show variations" legendOpen="hide variations">
          {rec.variations?.map((variation: GenericRecording, i) => (
            <div className="RecordingLayout__player-container">
              <AudioPlayer defaultGain={globalVolume} className="RecordingLayout__variations__variation" key={i} rec={variation} />
              <AudioPlayerOptions recording={variation} />
            </div>
          ))}
        </Dropdown>
      )}
    </div>
  );
};

export default RecordingLayout;
