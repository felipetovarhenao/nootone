import "./PlayView.scss";
import { useAppSelector } from "../../../redux/hooks";
import NoTracksView from "./NoTracksView/NoTracksView";
import MyIdeasView from "./MyIdeasView/MyIdeasView";

export default function PlayView() {
  const { recordings: savedRecordings } = useAppSelector((state) => state.recordings);
  return <div className="PlayView">{savedRecordings.length === 0 ? <NoTracksView /> : <MyIdeasView />}</div>;
}
