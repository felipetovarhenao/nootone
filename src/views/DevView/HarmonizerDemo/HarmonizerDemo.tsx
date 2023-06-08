import "./HarmonizerDemo.scss";
import { useEffect, useRef, useState } from "react";
import NoteHarmonizer from "../../../utils/NoteHarmonizer";
import Slider from "../../../components/Slider/Slider";
import AppName from "../../../components/AppName/AppName";
import AudioRecorder from "../../../features/AudioRecorder/AudioRecorder";
import { NoteEvent } from "../../../types/music";
import audioToNoteEvents from "../../../utils/audioToNoteEvents";
import audioArrayFromURL from "../../../utils/audioArrayFromURL";
import detectPitch from "../../../utils/detectPitch";
import applyVoiceLeading from "../../../utils/applyVoiceLeading";
import AudioSampler from "../../../utils/AudioSampler";
import AudioPlayer from "../../../utils/AudioPlayer";
import createNewAudioContext from "../../../utils/createNewAudioContext";
import Icon from "../../../components/Icon/Icon";

/* Guitar Samples */

import note1 from "../../../assets/audio/guitar/48-p.mp3";
import note2 from "../../../assets/audio/guitar/48-f.mp3";
import note3 from "../../../assets/audio/guitar/54-p.mp3";
import note4 from "../../../assets/audio/guitar/54-f.mp3";
import note5 from "../../../assets/audio/guitar/72-p.mp3";
import note6 from "../../../assets/audio/guitar/72-f.mp3";
import note7 from "../../../assets/audio/guitar/78-f.mp3";
import note9 from "../../../assets/audio/guitar/78-p.mp3";
import note10 from "../../../assets/audio/guitar/60-p.mp3";
import note11 from "../../../assets/audio/guitar/60-f.mp3";
import note12 from "../../../assets/audio/guitar/42-f.mp3";
import note13 from "../../../assets/audio/guitar/66-p.mp3";
import note14 from "../../../assets/audio/guitar/66-f.mp3";
import note15 from "../../../assets/audio/guitar/42-p.mp3";

const GUITAR_NOTES = [note1, note2, note3, note4, note5, note6, note7, note9, note10, note11, note12, note13, note14, note15];

const harmonyStyles = Object.keys(NoteHarmonizer.CHORD_COLLECTIONS);

var audioContext = createNewAudioContext();

const HarmonizerDemo = () => {
  const [harmonyStyle, setHarmonyStyle] = useState(harmonyStyles[0]);
  const [segSize, setSegSize] = useState(1);
  const [harmonicMemory, setHarmonicMemory] = useState(0.125);
  const [keySigWeight, setKeySigWeight] = useState(0.25);
  const [lookAhead, setLookAhead] = useState(2);
  const audioPlayer = useRef(new AudioPlayer(audioContext));
  const audioSampler = useRef(new AudioSampler(audioContext));
  const [melody, setMelody] = useState<NoteEvent[]>([]);
  const [pitchy, setPitchy] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [withMelody, setWithMelody] = useState(false);
  const activeNodes = useRef<AudioBufferSourceNode[]>([]);

  function handlePlay() {
    if (activeNodes.current.length > 0) {
      handleStop();
    }
    if (melody?.length > 0) {
      const harmonizer = new NoteHarmonizer();
      const harmony = harmonizer.harmonize(melody, harmonyStyle, Number(segSize), Number(harmonicMemory), Number(keySigWeight), Number(lookAhead));
      const chords = harmony.map((chord) => chord.notes.map((note) => note.pitch));

      const notes: NoteEvent[] = [];
      const progression = applyVoiceLeading(chords);
      progression.forEach((chord: number[], i) =>
        chord.forEach((pitch: number) => notes.push({ pitch: pitch, onset: i * segSize, duration: segSize, velocity: 0.5 }))
      );
      notes.forEach((note) => {
        const node = audioSampler.current.playNote(note.onset, note.pitch, note.velocity, note.duration);
        if (node) {
          activeNodes.current.push(node);
        }
      });
    }
    if (withMelody) {
      melody.forEach((note) => {
        const velocity = Math.random();
        const node = audioSampler.current.playNote(note.onset, note.pitch, velocity, note.duration);
        if (node) {
          activeNodes.current.push(node);
        }
      });
    } else {
      const node = audioPlayer.current.play();
      activeNodes.current.push(node);
    }
  }

  function handleStop() {
    while (activeNodes.current.length > 0) {
      activeNodes.current.pop()?.stop();
    }
  }

  useEffect(() => {
    setMelody([]);
    setIsProcessing(false);
  }, [pitchy]);

  useEffect(() => {
    audioSampler.current.loadSamples(GUITAR_NOTES);
  }, []);

  async function handleBlob(blob: Blob) {
    setIsProcessing(true);
    if (melody) {
      setMelody([]);
    }
    const url = URL.createObjectURL(blob);
    const { array, sampleRate } = await audioArrayFromURL(url);
    audioPlayer.current.loadSample(url);
    if (!pitchy) {
      const notes = await audioToNoteEvents(array);
      setMelody(notes as any);
      setIsProcessing(false);
    } else {
      const notes = detectPitch(array, sampleRate);
      setMelody(
        notes.map((n) => ({
          velocity: 0.5,
          ...n,
        }))
      );
      setIsProcessing(false);
    }
  }

  return (
    <div className="HarmonizerDemo">
      <h1 className="header">Harmonizer demo v2</h1>
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
        {melody.length > 0 && (
          <>
            <label htmlFor="">use recording</label>
            <input className="checkbox" type="checkbox" checked={!withMelody} onChange={() => setWithMelody((x) => !x)} />
            <label htmlFor="">play/listen</label>
            <div className="playback-controls">
              <Icon onClick={handlePlay} icon="ph:play-fill" />
              <Icon onClick={handleStop} icon="ion:stop" />
            </div>
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
