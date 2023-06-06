import "./PlaygroundView.scss";
import { useAppSelector } from "../../../redux/hooks";
import NoTracksView from "./NoTracksView/NoTracksView";
import MostRecentTracksView from "./MostRecentTracksView/MostRecentTracksView";

export default function PlaygroundView() {
  const { saved: savedRecordings, unsaved: unsavedRecordings } = useAppSelector((state) => state.recordings);
  return (
    <div className="PlaygroundView">
      {savedRecordings.length === 0 && unsavedRecordings.length === 0 ? <NoTracksView /> : <MostRecentTracksView />}
    </div>
  );
}
