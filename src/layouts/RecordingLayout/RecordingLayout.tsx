import "./RecordingLayout.scss";
import Icon from "../../components/Icon/Icon";
import Dropdown from "../../components/Dropdown/Dropdown";
import icons from "../../utils/icons";
import { Recording, RecordingVariation } from "../../types/audio";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";
import WaveSurferPlayer from "../../components/WaveSurferPlayer/WaveSurferPlayer";
import cn from "classnames";
import AudioPlayerOptions from "../AudioPlayerOptions/AudioPlayerOptions";
import useAnalyticsEventTracker, { EventName } from "../../hooks/useAnalyticsEventTracker";

type RecordingLayoutProps = {
  rec: Recording;
  recIndex: number;
  className?: string;
};

const RecordingLayout = ({ rec, recIndex, className }: RecordingLayoutProps) => {
  const navigate = useNavigate();
  const eventTracker = useAnalyticsEventTracker();

  return (
    <div className={cn(className, "RecordingLayout")}>
      <div className="RecordingLayout__main-container">
        <div className="RecordingLayout__player-container">
          <WaveSurferPlayer showDate={true} rec={rec} className="RecordingLayout__player" />
          <AudioPlayerOptions recording={rec} />
        </div>
      </div>
      <div className="RecordingLayout__buttons">
        <Button
          className="RecordingLayout__button"
          onClick={() => {
            eventTracker(EventName.DEVELOP_SKETCH);
            navigate(`/app/sketches/${recIndex}/develop`);
          }}
        >
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
          {rec.variations?.map((variation: RecordingVariation) => (
            <div key={variation.name} className="RecordingLayout__player-container">
              <div className="RecordingLayout__player-container__player">
                <WaveSurferPlayer showDate={true} rec={variation} className="RecordingLayout__variations__variation" />
                <AudioPlayerOptions className="RecordingLayout__variations__options" recording={variation} />
              </div>
            </div>
          ))}
        </Dropdown>
      )}
    </div>
  );
};

export default RecordingLayout;
