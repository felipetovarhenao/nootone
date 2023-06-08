// import { recordingActions } from "../../../../redux/recordings/recordingsSlice";
// import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { useEffect, useState } from "react";
import Icon from "../../../../components/Icon/Icon";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { useNotification } from "../../../../components/Notification/NotificationProvider";
import icons from "../../../../utils/icons";
import { recordingActions } from "../../../../redux/recordings/recordingsSlice";
import "./NewVariationView.scss";
import AudioPlayer from "../../../../components/AudioPlayer/AudioPlayer";
import ViewContainer from "../../../../components/ViewContainer/ViewContainer";

const NewVariationView = () => {
  const location = useLocation();
  const [selectedRecordingIndex, setSelectedRecordingIndex] = useState<number | null>(null);

  const { recordings } = useAppSelector((state) => state.recordings);
  const dispatch = useAppDispatch();
  const notification = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    const pathArray = location.pathname.split("/");
    const id = parseInt(pathArray.at(-1) as string);
    if (id >= 0 && id < recordings.length) {
      setSelectedRecordingIndex(id);
    } else {
      notification({
        type: "ERROR",
        message: "This recording doesn't exist",
        icon: icons.pause,
      });
      navigate("/app/playground/");
    }
  }, [location.pathname]);

  const processingOptions: ProcessingOption[] = [
    {
      name: "retune it",
      icon: "fluent:wand-16-filled",
      onClick: () => {},
    },
    {
      name: "add accompaniment",
      icon: "emojione-monotone:musical-notes",
      onClick: () => {
        if (selectedRecordingIndex !== null) {
          dispatch(recordingActions.harmonize(recordings[selectedRecordingIndex])).then(() => {
            navigate("/app/playground/");
          });
        }
      },
    },
    {
      name: "drumify it",
      icon: "fa6-solid:drum",
      onClick: () => {},
    },
  ];

  return (
    <ViewContainer viewName="new variation">
      {selectedRecordingIndex !== null && (
        <div className="NewVariationView">
          <div className="NewVariationView__header">
            <div className="">
              <h1 className="NewVariationView__header">{recordings[selectedRecordingIndex].name}</h1>
            </div>
            <div></div>
          </div>
          <AudioPlayer className="NewVariationView__player" showTitle={false} rec={recordings[selectedRecordingIndex]} />
          <div className="RecordingLayout__operations">
            {processingOptions.map((opt) => (
              <div className="RecordingLayout__operations__operation" key={opt.name} onClick={opt.onClick}>
                <Icon className="RecordingLayout__operations__operation__icon" icon={opt.icon} />
                <span className="RecordingLayout__operations__operation__text">{opt.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </ViewContainer>
  );
};

export default NewVariationView;

type ProcessingOption = {
  icon: string;
  name: string;
  onClick: (rec: any) => void;
};
