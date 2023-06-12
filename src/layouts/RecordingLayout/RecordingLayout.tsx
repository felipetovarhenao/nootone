import "./RecordingLayout.scss";
import AudioPlayer from "../../components/AudioPlayer/AudioPlayer";
import Icon from "../../components/Icon/Icon";
import Dropdown from "../../components/Dropdown/Dropdown";
import icons from "../../utils/icons";
import { GenericRecording, Recording } from "../../types/audio";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { recordingActions } from "../../redux/recordings/recordingsSlice";

const RecordingLayout = ({ rec, recIndex }: { rec: Recording; recIndex: number }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  function makeMenuOptions(recording: GenericRecording): any[] {
    const isVariation = recording.variations === undefined;
    const defaultOptions = [
      {
        label: "download audio",
        icon: icons.audio,
        component: "a",
        props: {
          href: recording.url,
          target: "_blank",
          rel: "noreferrer",
          download: recording.name,
        },
      },
      {
        label: "delete",
        icon: icons.trash,
        component: "div",
        props: {
          onClick: () => {
            if (isVariation) {
              dispatch(recordingActions.deleteVariation([rec, recording]));
            } else {
              dispatch(recordingActions.erase(recording as Recording));
            }
          },
          className: "--danger",
        },
      },
    ];
    const parentOptions = [
      {
        label: "settings",
        icon: icons.settings,
        component: "div",
        props: {
          onClick: () => {
            dispatch(recordingActions.selectRecording(recIndex));
            navigate(`/app/playground/recordings/${recIndex}/edit`);
          },
        },
      },
    ];
    return [...(!isVariation ? parentOptions : []), ...defaultOptions];
  }

  const [globalVolume, setGlobalVolume] = useState(0.707);

  return (
    <div className="RecordingLayout">
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <AudioPlayer
          menuOptions={makeMenuOptions(rec)}
          onGainChange={setGlobalVolume}
          showGain={true}
          className="RecordingLayout__player"
          rec={rec}
        />
      </div>
      <div className="RecordingLayout__buttons">
        <Button className="RecordingLayout__button" onClick={() => navigate(`/app/playground/recordings/${recIndex}`)}>
          <Icon className="icon" icon={icons.waveform} />
          new variation
        </Button>
        <span className="RecordingLayout__date">{rec.date}</span>
      </div>
      {rec.variations?.length > 0 && (
        <Dropdown className="RecordingLayout__variations" openByDefault={true} legendClosed="show variations" legendOpen="hide variations">
          {rec.variations?.map((variation: GenericRecording, i) => (
            <AudioPlayer
              menuOptions={makeMenuOptions(variation)}
              defaultGain={globalVolume}
              className="RecordingLayout__variations__variation"
              key={i}
              rec={variation}
            />
          ))}
        </Dropdown>
      )}
    </div>
  );
};

export default RecordingLayout;
