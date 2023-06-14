import Icon from "../../../components/Icon/Icon";
import { useAppSelector } from "../../../redux/hooks";
import icons from "../../../utils/icons";
import "./CaptureView.scss";
import MicrophoneView from "./MicrophoneView/MicrophoneView";

export default function CaptureView() {
  const { isPreprocessing } = useAppSelector((state) => state.mic);
  return (
    <div className="CaptureView">
      {isPreprocessing ? (
        <div className="CaptureView__processing">
          <Icon className="CaptureView__processing__icon" icon={icons.processing} />
        </div>
      ) : (
        <MicrophoneView />
      )}
    </div>
  );
}
