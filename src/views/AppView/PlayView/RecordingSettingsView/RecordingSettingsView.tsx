import "./RecordingSettingsView.scss";
import AudioPlayer from "../../../../components/AudioPlayer/AudioPlayer";
import Button from "../../../../components/Button/Button";
import Icon from "../../../../components/Icon/Icon";
import ViewContainer from "../../../../components/ViewContainer/ViewContainer";
import { useAppSelector } from "../../../../redux/hooks";
import icons from "../../../../utils/icons";
import { useRef } from "react";

const RecordingSettingsView = () => {
  const { recordings, selectedRecordingIndex } = useAppSelector((state) => state.recordings);
  if (selectedRecordingIndex === null) {
    return <></>;
  }

  const tags = useRef<string[]>([...recordings[selectedRecordingIndex].tags]);
  return (
    <ViewContainer className="RecordingSettingsView" viewName="recording settings">
      <AudioPlayer rec={recordings[selectedRecordingIndex]} />
      {recordings[selectedRecordingIndex].variations.map((recVar, i) => (
        <>
          <AudioPlayer key={i} rec={recVar} />
          {recVar.tags.map((tag: string, j) => (
            <span key={j}>{tag}</span>
          ))}
        </>
      ))}
      <div>
        {tags.current.map((tag: string, k) => (
          <span key={k}>{tag}</span>
        ))}
      </div>
      <Button color="danger">
        <Icon icon={icons.trash} /> delete
      </Button>
      <Button>
        <Icon icon={icons.save} /> save changes
      </Button>
    </ViewContainer>
  );
};

export default RecordingSettingsView;
