import "./PlayView.scss";
import { useAppSelector } from "../../../redux/hooks";
import NoTracksView from "./NoTracksView/NoTracksView";
import MostRecentTracksView from "./MostRecentTracksView/MostRecentTracksView";

export default function PlayView() {
  const { recordings: savedRecordings } = useAppSelector((state) => state.recordings);
  return <div className="PlayView">{savedRecordings.length === 0 ? <NoTracksView /> : <MostRecentTracksView />}</div>;
}
