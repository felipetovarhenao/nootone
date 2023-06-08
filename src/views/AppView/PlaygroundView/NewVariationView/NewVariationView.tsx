import { ReactNode, useEffect, useState } from "react";
import Icon from "../../../../components/Icon/Icon";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { useNotification } from "../../../../components/Notification/NotificationProvider";
import icons from "../../../../utils/icons";
import { recordingActions } from "../../../../redux/recordings/recordingsSlice";
import "./NewVariationView.scss";
import AudioPlayer from "../../../../components/AudioPlayer/AudioPlayer";
import ViewContainer from "../../../../components/ViewContainer/ViewContainer";
import Accordion, { AccordionItem } from "../../../../components/Accordion/Accordion";
import Button from "../../../../components/Button/Button";
import HarmonizerSettings from "./HarmonizerSettings/HarmonizerSettings";

const NewVariationView = () => {
  const location = useLocation();
  const [selectedRecordingIndex, setSelectedRecordingIndex] = useState<number | null>(null);
  const [settings, setSettings] = useState({});
  const [process, setProcess] = useState("");
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
      name: "add accompaniment",
      icon: "emojione-monotone:musical-notes",
      onClick: () => {
        if (selectedRecordingIndex !== null) {
          dispatch(recordingActions.harmonize(recordings[selectedRecordingIndex])).then(() => {
            navigate("/app/playground/");
          });
        }
      },
      component: <HarmonizerSettings name={"harmonizer"} setProcess={setProcess} setSettings={setSettings} />,
    },
    // {
    //   name: "retune it",
    //   icon: "fluent:wand-16-filled",
    //   onClick: () => {},
    // },
    // {
    //   name: "drumify it",
    //   icon: "fa6-solid:drum",
    //   onClick: () => {},
    // },
  ];

  function handleGenerate(process: string, settings: any) {
    console.log(process, settings);
  }

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
          <div className="NewVariationView__algorithms">
            <h2 className="NewVariationView__algorithms__prompt">What would you like to do with your idea?</h2>
            <Accordion className="NewVariationView__algorithms__options">
              {processingOptions.map((opt) => (
                <AccordionItem
                  className="NewVariationView__algorithms__options__option"
                  header={
                    <div className="NewVariationView__algorithms__options__option__header" key={opt.name}>
                      <Icon className="NewVariationView__algorithms__options__option__header__icon" icon={opt.icon} />
                      <span className="NewVariationView__algorithms__options__option__header__text">{opt.name}</span>
                    </div>
                  }
                  key={opt.name}
                >
                  <div className="NewVariationView__algorithms__options__option__settings">
                    <h1 className="NewVariationView__algorithms__options__option__settings__header">settings</h1>
                    {opt.component}
                  </div>
                </AccordionItem>
              ))}
            </Accordion>
            <Button className="NewVariationView__button" onClick={() => handleGenerate(process, settings)}>
              <Icon icon={icons.lab} />
              Generate
            </Button>
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
  component?: ReactNode;
};
