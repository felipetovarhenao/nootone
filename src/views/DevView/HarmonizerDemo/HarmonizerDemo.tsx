import "./HarmonizerDemo.scss";
import { useEffect, useRef, useState } from "react";
import NoteHarmonizer from "../../../utils/NoteHarmonizer";
import Slider from "../../../components/Slider/Slider";
import AppName from "../../../components/AppName/AppName";
import AudioRecorder from "../../../features/AudioRecorder/AudioRecorder";
import playNoteEvents, { NoteEvent } from "../../../utils/playNoteEvents";
import audioToNoteEvents from "../../../utils/audioToNoteEvents";
import audioArrayFromURL from "../../../utils/audioArrayFromURL";
import detectPitch from "../../../utils/detectPitch";

const harmonyStyles = Object.keys(NoteHarmonizer.CHORD_COLLECTIONS);

const HarmonizerDemo = () => {
  const [harmonyStyle, setHarmonyStyle] = useState(harmonyStyles[0]);
  const [segSize, setSegSize] = useState(1);
  const [harmonicMemory, setHarmonicMemory] = useState(0.125);
  const [keySigWeight, setKeySigWeight] = useState(0.25);
  const [lookAhead, setLookAhead] = useState(2);
  const [audioURL, setAudioURL] = useState("");
  const [melody, setMelody] = useState<NoteEvent[]>([]);
  const [pitchy, setPitchy] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [withMelody, setWithMelody] = useState(false);

  function handlePlay() {
    if (melody?.length > 0) {
      const harmonizer = new NoteHarmonizer();
      const harmony = harmonizer.harmonize(melody, harmonyStyle, Number(segSize), Number(harmonicMemory), Number(keySigWeight), Number(lookAhead));
      playNoteEvents(harmony);
    }
    if (withMelody) {
      playNoteEvents(melody);
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
  }

  useEffect(() => {
    setAudioURL("");
    setMelody([]);
    setIsProcessing(false);
  }, [pitchy]);

  function handleBlob(blob: Blob) {
    setIsProcessing(true);
    if (audioURL) {
      setAudioURL("");
      URL.revokeObjectURL(audioURL);
    }
    const url = URL.createObjectURL(blob);
    audioArrayFromURL(
      url,
      (audioData, sampleRate) => {
        console.log(sampleRate);
        if (!pitchy) {
          audioToNoteEvents(audioData, (noteEvents) => {
            setMelody(noteEvents);
            setAudioURL(url);
            setIsProcessing(false);
          });
        } else {
          const notes = detectPitch(audioData, sampleRate);
          setMelody(notes);
          setAudioURL(url);
          setIsProcessing(false);
        }
      },
      undefined,
      22050
    );
  }

  return (
    <div className="HarmonizerDemo">
      <h1 className="header">Harmonizer demo</h1>
      <fieldset className="fieldset">
        <legend className="legend">description</legend>
        <p>
          This is a dev demo of <AppName />
          's auto-harmonizer feature.
        </p>
        <p>As such, the UI exposes all settings, many of which will likely be unavailable for a real-life user.</p>
        <p>Similarly, the playback quality is well below what it's planned to be for the actual release.</p>
        <p>
          To use it, press the record button, and sing a tune. An audio playback compoenent will show up once it's been analyzed. When pressing play,
          you can hear the melody and the harmonization.
        </p>
        <br />
        <p>
          At the moment, there are two algorithmic options for pitch detection/segmentation: <b>pitchy</b> and <b>basicpitch</b>.
        </p>
        <br />
        <p>
          <b>basicpitch</b> uses deep learning, while <b>pitchy</b> uses classic MIR. One of the main trade-offs is robustness vs. processing time,
          where <b>basicpitch</b> usually does a good job at pitch detection but can much longer to process the input.
        </p>
        <p>Please check each algorithm and let me know which one seems more stable/convincing.</p>
      </fieldset>

      <fieldset className="fieldset settings">
        <legend className="legend">settings</legend>
        <label htmlFor="harmonyStyle">Style</label>
        <select className="select" name="harmonyStyle" id="" value={harmonyStyle} onChange={(e) => setHarmonyStyle(e.target.value)}>
          {harmonyStyles.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
        <label htmlFor="segSize">harmonic rate</label>
        <Slider name="segSize" value={segSize} setValue={setSegSize} inMin={0.25} inMax={4} step={0.05} unit={"s"} />
        <label htmlFor="harmonicMemory">harmonic memory</label>
        <Slider
          name="harmonicMemory"
          value={harmonicMemory}
          setValue={setHarmonicMemory}
          inMin={0}
          inMax={1}
          step={0.01}
          outMin={0}
          outMax={100}
          unit={"%"}
        />
        <label htmlFor="keySigWeight">key signature weight</label>
        <Slider
          name="keySigWeight"
          value={keySigWeight}
          setValue={setKeySigWeight}
          inMin={0}
          inMax={1}
          step={0.01}
          outMin={0}
          outMax={100}
          unit={"%"}
        />
        <label htmlFor="lookAhear">chord look-ahead</label>
        <Slider name="lookAhear" value={lookAhead} setValue={setLookAhead} inMin={1} inMax={4} step={1} />
      </fieldset>
      <fieldset className="fieldset audio-ctrl">
        <legend className="legend">audio</legend>
        <label>Pitch detector</label>
        <div className="algorithm-options">
          <input name="algorithm" onChange={() => setPitchy(false)} checked={!pitchy} id="BasicPitch" value="BasicPitch" type="radio" />
          <label htmlFor="BasicPitch">BasicPitch</label>
          <input name="algorithm" onChange={() => setPitchy(true)} checked={pitchy} id="Pitchy" value="Pitchy" type="radio" />
          <label htmlFor="Pitchy">Pitchy</label>
        </div>
        <label htmlFor="">record</label>
        <div>
          <AudioRecorder handleBlob={handleBlob} />
        </div>
        {audioURL && (
          <>
            <label htmlFor="">use recording</label>
            <input className="checkbox" type="checkbox" checked={!withMelody} onChange={() => setWithMelody((x) => !x)} />
            <label htmlFor="">play/listen</label>
            <audio ref={audioRef} onPlay={handlePlay} controls>
              <source src={audioURL} type="audio/webm" />
            </audio>
          </>
        )}
        {isProcessing && (
          <>
            <div></div>
            <span className="processing">processing audio...</span>
          </>
        )}
      </fieldset>
    </div>
  );
};

export default HarmonizerDemo;
