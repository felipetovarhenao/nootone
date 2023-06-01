import { Icon } from "@iconify/react";
import "./RecordView.scss";
import { useEffect, useState } from "react";

export default function RecordView() {
  const [isRecording, setIsRecording] = useState(false);
  const [inputRecording, setInputRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const processingOptions = [
    {
      name: "retune it",
      icon: "fluent:wand-16-filled",
    },
    {
      name: "add accompaniment",
      icon: "emojione-monotone:musical-notes",
    },
    {
      name: "drumify it",
      icon: "fa6-solid:drum",
    },
    {
      name: "keep it as is",
      icon: "bx:cool",
    },
  ];

  const playbackOptions = [
    {
      icon: "solar:play-bold",
    },
    {
      icon: "solar:pause-bold",
    },
    {
      icon: "solar:stop-bold",
    },
  ];

  useEffect(() => {
    if (isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setInputRecording(true);
      }, 2000);
    }
  }, [isRecording]);

  function handleProcessing() {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setInputRecording(false);
      setIsRecording(false);
    }, 2000);
  }
  return (
    <div className="RecordView">
      {!inputRecording ? (
        !isRecording ? (
          <div className="record-button" onClick={() => setIsRecording((x) => !x)}>
            <Icon className="icon" icon="fluent:record-24-regular" />
            <span className="text">press to record!</span>
          </div>
        ) : (
          <span className="recording-animation">[placeholder for recording animation]</span>
        )
      ) : (
        <div className="post-recording-subview">
          {!isProcessing ? (
            <>
              <div className="input-recording">
                <div className="waveform">
                  {[...Array(20).keys()].map((key) => (
                    <div key={key}>
                      <Icon className="icon" icon="ph:waveform-bold" />
                    </div>
                  ))}
                </div>
                <div className="playback-toolbar">
                  {playbackOptions.map((opt) => (
                    <Icon className="icon" key={opt.icon} icon={opt.icon} />
                  ))}
                </div>
              </div>
              <div className="menu">
                <div className="description">What would you like to do with your recording?</div>
                <div className="options">
                  {processingOptions.map((opt) => (
                    <div className="option" key={opt.name} onClick={handleProcessing}>
                      <Icon className="icon" icon={opt.icon} />
                      <span className="text">{opt.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="processing-wheel">
              <Icon className="icon" icon="eos-icons:bubble-loading" />
              <span className="text">processing</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
