import "./AudioPlayerOptions.scss";
import HamburgerDropdown from "../../components/HamburgerDropdown/HamburgerDropdown";
import Icon from "../../components/Icon/Icon";
import { GenericRecording } from "../../types/audio";
import icons from "../../utils/icons";
import downloadMIDI from "../../utils/downloadMIDI";
import createMidiFile from "../../utils/createMidiFile";
import { useDispatch } from "react-redux";
import { recordingActions } from "../../redux/recordings/recordingsSlice";
// import { useNavigate } from "react-router-dom";
// import getRecordingLocation from "../../utils/getRecordingLocation";
// import { useAppSelector } from "../../redux/hooks";
import cn from "classnames";
import downloadURL from "../../utils/downloadURL";
import useDialog, { DialogProps } from "../../components/Dialog/Dialog";
import { useNotification } from "../../components/Notification/NotificationProvider";

type AudioPlayerOptionsProps = {
  recording: GenericRecording;
  className?: string;
};

type Options = {
  label: string;
  value: any;
  icon: string;
  props: any;
}[];

const AudioPlayerOptions = ({ recording }: AudioPlayerOptionsProps) => {
  const dispatch = useDispatch();
  const dialog = useDialog();
  const notification = useNotification();
  // const navigate = useNavigate();
  // const { recordings } = useAppSelector((state) => state.recordings);
  const deleteDialog: DialogProps = {
    header: "WAIT!",
    message: `You're about to delete this recording.${
      recording.variations !== undefined && recording.variations?.length > 0 ? " This will also delete all variations." : ""
    }\nAre you sure you want to proceed?`,
    buttons: [
      {
        label: "delete",
        icon: "",
        type: "danger",
        onClick: (closeDialog) => {
          closeDialog();
          notification({ type: "SUCCESS", icon: icons.check, message: "Recording deleted" });
          dispatch(recordingActions.delete(recording));
        },
      },
      {
        label: "cancel",
        icon: "",
        onClick: (closeDialog) => {
          closeDialog();
        },
      },
    ],
  };
  function makeMenuOptions(): any[] {
    const isVariation = recording.variations === undefined;
    const defaultOptions: Options = [
      {
        label: "download audio",
        icon: icons.audio,
        value: "a",
        props: {
          onClick: () => {
            downloadURL(recording.url, recording.name);
          },
        },
      },
      {
        label: "delete",
        icon: icons.trash,
        value: "div",
        props: {
          onClick: () => {
            dialog(deleteDialog);
          },
          className: "--danger",
        },
      },
    ];
    const variationOptions = [];
    if (recording.features?.chordEvents && recording.features?.tempo) {
      variationOptions.push({
        label: "export MIDI",
        icon: icons.midi,
        value: "div",
        props: {
          onClick: () => {
            const midi = createMidiFile(recording.features.chordEvents!, recording.features.tempo!);
            downloadMIDI(midi, recording.name);
          },
        },
      });
    }

    const parentOptions: Options[] = [
      // {
      //   label: "settings",
      //   icon: icons.settings,
      //   value: "div",
      //   props: {
      //     onClick: () => {
      //       const { parentIndex } = getRecordingLocation(recordings, recording);
      //       if (parentIndex === undefined) {
      //         return;
      //       }
      //       dispatch(recordingActions.selectRecording(parentIndex));
      //       navigate(`/app/play/recordings/${parentIndex}/edit`);
      //     },
      //   },
      // },
    ];
    return [...(!isVariation ? parentOptions : []), ...variationOptions, ...defaultOptions];
  }

  return (
    <HamburgerDropdown className={cn("AudioPlayerOptions")}>
      {makeMenuOptions().map((opt, i) => {
        const { className: cname, ...rest } = opt.props;
        return (
          <div className={cn(cname, "AudioPlayerOptions__option")} key={i} {...rest}>
            <Icon className="AudioPlayerOptions__option__icon" icon={opt.icon} />
            {opt.label}
          </div>
        );
      })}
    </HamburgerDropdown>
  );
};

export default AudioPlayerOptions;
