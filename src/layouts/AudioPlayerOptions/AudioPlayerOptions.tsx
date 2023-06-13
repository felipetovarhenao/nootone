import HamburgerDropdown from "../../components/HamburgerDropdown/HamburgerDropdown";
import Icon from "../../components/Icon/Icon";
import { GenericRecording } from "../../types/audio";
import icons from "../../utils/icons";

type AudioPlayerOptionsProps = {
  recording: GenericRecording;
};

type Options = {
  label: string;
  value: any;
  icon: string;
}[];

const AudioPlayerOptions = ({ recording }: AudioPlayerOptionsProps) => {
  function makeMenuOptions(): any[] {
    const isVariation = recording.variations === undefined;
    const defaultOptions: Options = [
      {
        label: "download audio",
        icon: icons.audio,
        value: "a",
        // props: {
        //   href: recording.url,
        //   target: "_blank",
        //   rel: "noreferrer",
        //   download: recording.name,
        // },
      },
      {
        label: "delete",
        icon: icons.trash,
        value: "div",
        // props: {
        //   onClick: () => {
        //     if (isVariation) {
        //       dispatch(recordingActions.deleteVariation([rec, recording]));
        //     } else {
        //       dispatch(recordingActions.erase(recording as Recording));
        //     }
        //   },
        //   className: "--danger",
        // },
      },
    ];
    const variationOptions = [];
    if (recording.features?.chordEvents && recording.features?.tempo) {
      variationOptions.push({
        label: "export MIDI",
        icon: icons.midi,
        value: "div",
        // props: {
        //   onClick: () => {
        //     const midi = createMidiFile(recording.features.chordEvents!, recording.features.tempo!);
        //     downloadMIDI(midi, recording.name);
        //   },
        // },
      });
    }
    const parentOptions = [
      {
        label: "settings",
        icon: icons.settings,
        value: "div",
        // props: {
        //   onClick: () => {
        //     dispatch(recordingActions.selectRecording(recIndex));
        //     navigate(`/app/play/recordings/${recIndex}/edit`);
        //   },
        // },
      },
    ];
    return [...(!isVariation ? parentOptions : []), ...variationOptions, ...defaultOptions];
  }

  return (
    <HamburgerDropdown className="AudioPlayerOptions">
      {makeMenuOptions().map((opt, i) => (
        <div key={i} onClick={() => console.log(opt.value)}>
          <Icon icon={opt.icon} />
          {opt.label}
        </div>
      ))}
    </HamburgerDropdown>
  );
};

export default AudioPlayerOptions;
