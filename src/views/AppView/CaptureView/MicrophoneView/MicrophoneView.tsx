import "./MicrophoneView.scss";
import useAudioRecorder from "../../../../hooks/useAudioRecorder";
import Icon from "../../../../components/Icon/Icon";
import cn from "classnames";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { recordingActions } from "../../../../redux/recordings/recordingsSlice";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import getFormattedTimestamp from "../../../../utils/getFormattedTimestamp";
import TempoTapper from "../../../../layouts/TempoTapper/TempoTapper";
import { micActions } from "../../../../redux/micSlice";
import { useNotification } from "../../../../components/Notification/NotificationProvider";
import getAudioDuration from "../../../../utils/getAudioDuration";
import createUniqueTitle from "../../../../utils/createUniqueTitle";
import TextCarousel from "../../../../components/TextCarousel/TextCarousel";
import Metronome from "../../../../components/Metronome/Metronome";
import encodeBlobAsWav from "../../../../utils/encodeBlobAsWav";
import * as Tone from "tone";
import SwipeMenu from "../../../../components/SwipeMenu/SwipeMenu";
import CountdownSettingsLayout from "../../../../layouts/CountdownSettingsLayout/CountdownSettingsLayout";
import ReferencePitchSettingLayout from "../../../../layouts/ReferencePitchSettingLayout/ReferencePitchSettingLayout";
import CONFIG, { DeploymentType } from "../../../../utils/config";
import MicrophoneSettingsLayout from "../../../../layouts/MicrophoneSettingsLayout/MicrophoneSettingsLayout";
import CacheAPI from "../../../../utils/CacheAPI";

const inputSuggestions = ["turn a melody into song", "click to record", "capture your idea", "sing a tune", "hum a melody", "whistle a song"];
const recordingPrompts = ["recording your idea", "press stop when you're ready"];

const MicrophoneView = () => {
  const { startRecording, stopRecording, isRecording, audioBlob, setMicSettings } = useAudioRecorder();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const notification = useNotification();
  const [recTitle, setRecTitle] = useState(createUniqueTitle());
  const { tempo, numCountBeats, micSettings } = useAppSelector((state) => state.mic);
  const startTime = useRef(0);
  const location = useLocation();
  const [settingIndex, setSettingIndex] = useState(0);

  useEffect(() => {
    setMicSettings(micSettings);
  }, [micSettings]);

  useEffect(() => {
    async function processRecording() {
      // do nothing if recording in progress or no audio blob available
      if (isRecording || !audioBlob) {
        return;
      }
      // start processing
      dispatch(micActions.togglePreprocessing());

      // initialize blob, use as fallback in case of error
      let recordingBlob = audioBlob;

      try {
        // encode as wav
        recordingBlob = await encodeBlobAsWav(audioBlob, { startTime: numCountBeats * (60 / tempo), maxdB: -6 });

        if ([DeploymentType.PRE].includes(CONFIG.deploymentType)) {
          if (location.search.includes("raw")) {
            throw new Error("skipping API call");
          }

          // create form data
          const formData = new FormData();
          formData.append("file", recordingBlob);

          let apiEndpoint = `https://api.nootone.io/generate/constanttempo/?user_tempo=${tempo}`;

          if (location.search.includes("debug")) {
            apiEndpoint += "&debug=true";
          }

          const response = await fetch(apiEndpoint, {
            method: "PUT",
            body: formData,
          });

          recordingBlob = await response.blob();
        }
      } catch (error: any) {
        console.log("API call failed: ", error);
      } finally {
        try {
          const duration = await getAudioDuration(recordingBlob);
          const rec = {
            url: URL.createObjectURL(recordingBlob),
            name: recTitle || getFormattedTimestamp(),
            duration: duration,
            features: {
              tempo: tempo,
            },
          };
          dispatch(recordingActions.addNew(rec));
          navigate("/app/ideas/recordings/0/develop");
        } catch (error) {
          console.log(error);
        } finally {
          dispatch(micActions.togglePreprocessing());
        }
      }
    }
    processRecording();
  }, [isRecording]);

  function handleSettingSwipe(i: number) {
    setSettingIndex(i);
    CacheAPI.setLocalItem("micSettingIndex", i);
  }

  useEffect(() => {
    const cache = CacheAPI.getLocalItem("micSettingIndex");
    if (cache !== null && typeof cache === "number") {
      setSettingIndex(cache);
    }
  }, []);

  return (
    <div className="MicrophoneView">
      <div className="MicrophoneView__title">
        <h1 className="MicrophoneView__title__label">recording title</h1>
        <input
          disabled={isRecording}
          className="MicrophoneView__title__input"
          type="text"
          placeholder={"title"}
          value={recTitle}
          onChange={(e) => setRecTitle(e.target.value)}
          maxLength={36}
        />
      </div>
      <div className="MicrophoneView__center-container">
        <TextCarousel duration={2.5} className="MicrophoneView__prompt">
          {(isRecording ? recordingPrompts : inputSuggestions).map((txt) => (
            <span className="MicrophoneView__prompt__slide" key={txt}>
              {txt}
            </span>
          ))}
        </TextCarousel>
        {!isRecording ? (
          <Icon
            className={cn("MicrophoneView__icon", { "--is-recording": isRecording })}
            icon={"fluent:record-48-regular"}
            onClick={async () => {
              if (Tone.context.state !== "running") {
                await Tone.start();
              }
              if (navigator.mediaDevices?.getUserMedia!) {
                await startRecording();
                startTime.current = Date.now();
                dispatch(micActions.toggle());
              } else if (!isRecording) {
                notification({
                  type: "DANGER",
                  icon: "material-symbols:error",
                  message: "Unable to record. Try using another a different browser, such as Google Chrome or Mozilla Firefox.",
                });
              }
            }}
          />
        ) : (
          <Metronome
            padding={30}
            className="MicrophoneView__icon"
            onClick={() => {
              // don't stop recording if counter is still active
              if (Date.now() - startTime.current < numCountBeats * (60000 / tempo)) {
                return;
              }
              dispatch(micActions.toggle());
              stopRecording();
            }}
            tempo={tempo}
            canvasDims={{ width: 130, height: 130 }}
          />
        )}
      </div>
      <SwipeMenu defaultValue={settingIndex} className="MicrophoneView__settings" onSwiped={handleSettingSwipe}>
        <TempoTapper className="MicrophoneView__settings__setting" />
        <CountdownSettingsLayout disabled={isRecording} className="MicrophoneView__settings__setting" />
        <ReferencePitchSettingLayout disabled={isRecording} className="MicrophoneView__settings__setting" />
        <MicrophoneSettingsLayout disabled={isRecording} />
      </SwipeMenu>
    </div>
  );
};

export default MicrophoneView;
