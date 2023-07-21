import "./AudioPlayerOptions.scss";
import HamburgerDropdown from "../../components/HamburgerDropdown/HamburgerDropdown";
import Icon from "../../components/Icon/Icon";
import { Recording, RecordingVariation } from "../../types/audio";
import icons from "../../utils/icons";
import downloadMIDI from "../../utils/downloadMIDI";
import createMidiFile from "../../utils/createMidiFile";
import { useDispatch } from "react-redux";
import { recordingActions } from "../../redux/recordings/recordingsSlice";
import cn from "classnames";
import downloadURL from "../../utils/downloadURL";
import useDialog, { DialogProps } from "../../components/Dialog/Dialog";
import { useNotification } from "../../components/Notification/NotificationProvider";
import { usePrintableMusicScore } from "../../components/PrintableMusicScore/PrintableMusicScore";
import { useNavigate } from "react-router-dom";

type AudioPlayerOptionsProps = {
  recording: Recording | RecordingVariation;
  className?: string;
};

type Options = {
  label: string;
  value: any;
  icon: string;
  props: any;
}[];

const AudioPlayerOptions = ({ recording, className }: AudioPlayerOptionsProps) => {
  const dispatch = useDispatch();
  const dialog = useDialog();
  const notification = useNotification();
  const updateMusicScore = usePrintableMusicScore();
  const navigate = useNavigate();

  const deleteDialog: DialogProps = {
    header: "WAIT!",
    message: `You're about to delete this recording.${
      "variations" in recording && recording.variations?.length > 0 ? " This will also delete all related variations." : ""
    }\n\nDo you want to proceed?`,
    buttons: [
      {
        label: "delete",
        icon: "",
        type: "danger",
        onClick: (closeDialog) => {
          closeDialog();
          notification({ type: "SUCCESS", icon: icons.check, message: "Recording deleted" });
          dispatch(recordingActions.delete(recording));
          navigate("/app/ideas/");
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
    const isVariation = !("variations" in recording);
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
    if (recording.features?.symbolicTranscription && recording.features?.tempo) {
      variationOptions.push({
        label: "export MIDI",
        icon: icons.midi,
        value: "div",
        props: {
          onClick: () => {
            const midi = createMidiFile(recording.features.symbolicTranscription!, recording.features.tempo!);
            downloadMIDI(midi, recording.name);
          },
        },
      });
      variationOptions.push({
        label: "view score",
        icon: icons.notation,
        value: "div",
        props: {
          onClick: () => {
            updateMusicScore({ musicSequence: recording.features.symbolicTranscription!, recordingURL: recording.url });
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
      //       navigate(`/app/ideas/recordings/${parentIndex}/edit`);
      //     },
      //   },
      // },
    ];
    return [...(!isVariation ? parentOptions : []), ...variationOptions, ...defaultOptions];
  }

  return (
    <div className={cn(className, "AudioPlayerOptions")}>
      <HamburgerDropdown>
        {makeMenuOptions().map((opt) => {
          const { className: cname, ...rest } = opt.props;
          return (
            <div className={cn(cname, "AudioPlayerOptions__option")} key={opt.label} {...rest}>
              <Icon className="AudioPlayerOptions__option__icon" icon={opt.icon} />
              {opt.label}
            </div>
          );
        })}
      </HamburgerDropdown>
    </div>
  );
};

export default AudioPlayerOptions;
