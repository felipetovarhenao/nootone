import "./RecordingLayout.scss";
import AudioPlayer from "../../components/AudioPlayer/AudioPlayer";
import Icon from "../../components/Icon/Icon";
import Dropdown from "../../components/Dropdown/Dropdown";
import icons from "../../utils/icons";
import { Recording } from "../../types/audio";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const RecordingLayout = ({ rec, recIndex }: { rec: Recording; recIndex: number }) => {
  const navigate = useNavigate();

  const [globalVolume, setGlobalVolume] = useState(0.707);

  return (
    <div className="RecordingLayout">
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <AudioPlayer onGainChange={setGlobalVolume} showGain={true} className="RecordingLayout__player" rec={rec} />
      </div>
      <div className="RecordingLayout__buttons">
        <Button className="RecordingLayout__button" onClick={() => navigate(`/app/playground/recordings/${recIndex}`)}>
          <Icon className="icon" icon={icons.lab} />
          new variation
        </Button>
        <span className="RecordingLayout__date">{rec.date}</span>
      </div>
      {rec.variations?.length > 0 && (
        <Dropdown className="RecordingLayout__variations" openByDefault={true} legendClosed="show variations" legendOpen="hide variations">
          {rec.variations?.map((variation, i) => (
            <AudioPlayer defaultGain={globalVolume} className="RecordingLayout__variations__variation" key={i} rec={variation} />
          ))}
        </Dropdown>
      )}
    </div>
  );
};

export default RecordingLayout;
