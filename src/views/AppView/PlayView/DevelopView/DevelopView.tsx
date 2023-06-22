import { ReactNode, useEffect, useState } from "react";
import Icon from "../../../../components/Icon/Icon";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { useNotification } from "../../../../components/Notification/NotificationProvider";
import icons from "../../../../utils/icons";
import { recordingActions } from "../../../../redux/recordings/recordingsSlice";
import "./DevelopView.scss";
import AudioPlayer from "../../../../components/AudioPlayer/AudioPlayer";
import ViewContainer from "../../../../components/ViewContainer/ViewContainer";
import Accordion, { AccordionItem } from "../../../../components/Accordion/Accordion";
import Button from "../../../../components/Button/Button";
import HarmonizerSettings from "./HarmonizerSettings/HarmonizerSettings";
import getRecordingIndexFromPath from "../../../../utils/getRecordingIndexFromPath";

const DevelopView = () => {
  const location = useLocation();
  const [settings, setSettings] = useState({});
  const [process, setProcess] = useState("");
  const { selectedRecordingIndex, recordings, variationBuffer, isProcessing, keptVariationsBuffer } = useAppSelector((state) => state.recordings);
  const dispatch = useAppDispatch();
  const notification = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    const id = getRecordingIndexFromPath(location.pathname);
    if (id !== null && id >= 0 && id < recordings.length) {
      dispatch(recordingActions.selectRecording(id));
    } else {
      notification({
        type: "ERROR",
        message: "This recording doesn't exist",
        icon: icons.error,
      });
      navigate("/app/play/");
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

  return (
    <ViewContainer viewName="" onGoBack={() => navigate("/app/play")}>
      {selectedRecordingIndex !== null && (
        <div className="DevelopView">
          <div className="DevelopView__header">
            <div className="">
              <h1 className="DevelopView__header">{recordings[selectedRecordingIndex].name}</h1>
            </div>
            <div></div>
          </div>
          <AudioPlayer className="DevelopView__player" showTitle={false} rec={recordings[selectedRecordingIndex]} />
          {keptVariationsBuffer.length > 0 && (
            <div className="DevelopView__kept-variations">
              <h1 className="DevelopView__kept-variations__label">my new variations</h1>
              <div className="DevelopView__kept-variations__container">
                {keptVariationsBuffer.map((variation, i) => (
                  <AudioPlayer className="DevelopView__kept-variations__container__variation" key={i} rec={variation} />
                ))}
              </div>
            </div>
          )}
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
                        <AudioPlayer className="DevelopView__preview__player" rec={variationBuffer} />
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
                            // navigate("/app/play/");
                          }}
                        >
                          <Icon icon={icons.heart} />
                          Keep
                        </Button>
                      ) : (
                        <div />
                      )}
                    </div>
                    {/* <h1 className="DevelopView__algorithms__options__option__settings__header">settings</h1> */}
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
