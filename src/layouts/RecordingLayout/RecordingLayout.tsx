import "./RecordingLayout.scss";
import Icon from "../../components/Icon/Icon";
import Dropdown from "../../components/Dropdown/Dropdown";
import icons from "../../utils/icons";
import { GenericRecording, Recording } from "../../types/audio";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";
import AudioPlayerOptions from "../AudioPlayerOptions/AudioPlayerOptions";
import WaveSurferPlayer from "../../components/WaveSurferPlayer/WaveSurferPlayer";
import cn from "classnames";

type RecordingLayoutProps = {
  rec: Recording;
  recIndex: number;
  className?: string;
};

const RecordingLayout = ({ rec, recIndex, className }: RecordingLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className={cn(className, "RecordingLayout")}>
      <div className="RecordingLayout__main-container">
        <div className="RecordingLayout__player-container">
          <WaveSurferPlayer showDate={true} rec={rec} className="RecordingLayout__player" />
          <AudioPlayerOptions className="RecordingLayout__player-container__menu" recording={rec} />
        </div>
      </div>
      <div className="RecordingLayout__buttons">
        <Button className="RecordingLayout__button" onClick={() => navigate(`/app/ideas/recordings/${recIndex}/develop`)}>
          <Icon className="icon" icon={icons.waveform} />
          develop
        </Button>
      </div>
      {rec.variations?.length > 0 && (
        <Dropdown
          className="RecordingLayout__variations"
          openByDefault={false}
          legendClosed={`show variations (${rec.variations?.length})`}
          legendOpen={`hide variations (${rec.variations?.length})`}
        >
          {rec.variations?.map((variation: GenericRecording) => (
            <div key={variation.name} className="RecordingLayout__player-container">
              <WaveSurferPlayer showDate={true} rec={variation} className="RecordingLayout__variations__variation" />
              <AudioPlayerOptions className="RecordingLayout__player-container__menu" recording={variation} />
            </div>
          ))}
        </Dropdown>
      )}
    </div>
  );
};

export default RecordingLayout;
