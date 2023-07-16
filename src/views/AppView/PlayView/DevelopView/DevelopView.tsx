import "./DevelopView.scss";
import { ReactNode, useEffect, useState } from "react";
import Icon from "../../../../components/Icon/Icon";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { useNotification } from "../../../../components/Notification/NotificationProvider";
import icons from "../../../../utils/icons";
import { recordingActions } from "../../../../redux/recordings/recordingsSlice";
import ViewContainer from "../../../../components/ViewContainer/ViewContainer";
import Accordion, { AccordionItem } from "../../../../components/Accordion/Accordion";
import Button from "../../../../components/Button/Button";
import HarmonizerSettings from "./HarmonizerSettings/HarmonizerSettings";
import getRecordingIndexFromPath from "../../../../utils/getRecordingIndexFromPath";
import NewVariationsLayout from "../../../../layouts/NewVariationsLayout/NewVariationsLayout";
import WaveSurferPlayer from "../../../../components/WaveSurferPlayer/WaveSurferPlayer";
import MusicScoreDisplay from "../../../../components/MusicScoreDisplay/MusicScoreDisplay";
import EditableField from "../../../../components/EditableField/EditableField";

const DevelopView = () => {
  const location = useLocation();
  const [settings, setSettings] = useState({});
  const [process, setProcess] = useState("");
  const { selectedRecordingIndex, recordings, variationBuffer, isProcessing } = useAppSelector((state) => state.recordings);
  const dispatch = useAppDispatch();
  const notification = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    const id = getRecordingIndexFromPath(location.pathname);
    if (id !== null && id >= 0 && id < recordings.length) {
      dispatch(recordingActions.selectRecording(id));
    } else {
      notification({
        type: "DANGER",
        message: "This recording doesn't exist",
        icon: icons.error,
      });
      navigate("/app/ideas/");
    }
  }, [location.pathname]);

  const processingOptions: ProcessingOption[] = [
    {
      name: "add accompaniment",
      icon: "emojione-monotone:musical-notes",
      component: <HarmonizerSettings name={"harmonizer"} setProcess={setProcess} setSettings={setSettings} />,
    },
    // {
    //   name: "retune it",
    //   icon: "fluent:wand-16-filled",
    // },
    // {
    //   name: "drumify it",
    //   icon: "fa6-solid:drum",
    // },
  ];

  function handleGenerate(process: string, settings: any) {
    if (selectedRecordingIndex === null) {
      return;
    }
    switch (process) {
      case "harmonizer":
        dispatch(recordingActions.harmonize({ recording: recordings[selectedRecordingIndex], settings: settings }));
    }
  }

  useEffect(() => {
    dispatch(recordingActions.clearVariationBuffer());
  }, [process]);

  function handleRecordingTitleEdit(title: string) {
    if (selectedRecordingIndex === null) {
      return;
    }
    dispatch(recordingActions.setRecordingTitle({ recording: recordings[selectedRecordingIndex], title }));
  }

  return (
    <ViewContainer viewName="" onGoBack={() => navigate("/app/ideas")}>
      {selectedRecordingIndex !== null && (
        <div className="DevelopView">
          <div className="DevelopView__header">
            <div className="">
              <EditableField
                key={recordings[selectedRecordingIndex].name}
                onConfirm={handleRecordingTitleEdit}
                className="DevelopView__header"
                defaultValue={recordings[selectedRecordingIndex].name}
              />
              {/* <h1 className="DevelopView__header">{recordings[selectedRecordingIndex].name}</h1> */}
            </div>
            <div></div>
          </div>
          <WaveSurferPlayer showTitle={false} className="DevelopView__player" rec={recordings[selectedRecordingIndex]} />
          <NewVariationsLayout />
          <div className="DevelopView__algorithms">
            <Accordion className="DevelopView__algorithms__options">
              {processingOptions.map((opt) => (
                <AccordionItem
                  className="DevelopView__algorithms__options__option"
                  header={
                    <div className="DevelopView__algorithms__options__option__header" key={opt.name}>
                      <Icon className="DevelopView__algorithms__options__option__header__icon" icon={opt.icon} />
                      <span className="DevelopView__algorithms__options__option__header__text">{opt.name}</span>
                    </div>
                  }
                  key={opt.name}
                >
                  <div className="DevelopView__algorithms__options__option__settings">
                    {variationBuffer && (
                      <>
                        <h1 className="DevelopView__preview__label">preview</h1>
                        {variationBuffer.features.symbolicRepresentation && (
                          <MusicScoreDisplay musicSequence={variationBuffer.features.symbolicRepresentation} recording={variationBuffer} />
                        )}
                      </>
                    )}
                    {isProcessing && <Icon className="DevelopView__suspense" icon={icons.processing} />}
                    <div className="DevelopView__buttons">
                      <Button disabled={isProcessing} id="generate" className="DevelopView__button" onClick={() => handleGenerate(process, settings)}>
                        <Icon icon={icons.lab} />
                        {variationBuffer ? "try again" : "generate"}
                      </Button>
                      {variationBuffer ? (
                        <Button
                          disabled={!variationBuffer}
                          id="save"
                          className="DevelopView__button"
                          onClick={() => {
                            dispatch(recordingActions.keepVariation());
                          }}
                        >
                          <Icon icon={icons.heart} />
                          Keep
                        </Button>
                      ) : (
                        <div />
                      )}
                    </div>
                    {opt.component}
                  </div>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      )}
    </ViewContainer>
  );
};

export default DevelopView;

type ProcessingOption = {
  icon: string;
  name: string;
  component?: ReactNode;
};
