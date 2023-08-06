import "./HarmonizerLayout.scss";
import NoteHarmonizer from "../../../../../utils/NoteHarmonizer";
import SwipeMenu from "../../../../../components/SwipeMenu/SwipeMenu";
import { useEffect, useState } from "react";
import { HarmonizerSettings } from "../../../../../redux/recordings/harmonizeTypes";
import { InstrumentName } from "../../../../../types/music";
import CacheAPI from "../../../../../utils/CacheAPI";
import wrapValue from "../../../../../utils/wrapValue";

const styles = Object.keys(NoteHarmonizer.CHORD_COLLECTIONS);

const applyCurve = (x: number, curve: number = 1.25) => x ** curve;

const groovinessOptions = [
  {
    label: "low",
    value: {
      min: 0,
      max: 1 / 3,
    },
  },
  {
    label: "medium",
    value: {
      min: 1 / 3,
      max: 2 / 3,
    },
  },
  {
    label: "high",
    value: {
      min: 2 / 3,
      max: 1,
    },
  },
];

const timeSigs = [
  {
    label: "2/4",
    value: {
      segSizes: [2],
      patternSize: 2,
      maxSubdiv: 4,
    },
  },
  {
    label: "3/4",
    value: {
      segSizes: [3],
      patternSize: 3,
      maxSubdiv: 4,
    },
  },
  {
    label: "4/4",
    value: {
      segSizes: [2, 4],
      patternSize: 4,
      maxSubdiv: 4,
    },
  },
  {
    label: "6/8",
    value: {
      segSizes: [2],
      patternSize: 2,
      maxSubdiv: 3,
    },
  },
  {
    label: "9/8",
    value: {
      segSizes: [3],
      patternSize: 3,
      maxSubdiv: 3,
    },
  },
  {
    label: "12/8",
    value: {
      segSizes: [2, 4],
      patternSize: 4,
      maxSubdiv: 3,
    },
  },
];

const complexity = [
  {
    label: "minimal",
    value: {
      min: 0,
      max: 0,
    },
  },
  {
    label: "simple",
    value: {
      min: applyCurve(1 / 4),
      max: applyCurve(1 / 3),
    },
  },
  {
    label: "normal",
    value: {
      min: applyCurve(1 / 3),
      max: applyCurve(2 / 3),
    },
  },
  {
    label: "complex",
    value: {
      min: applyCurve(2 / 3),
      max: 1,
    },
  },
];

const instrumentOptions = [
  {
    label: "grand piano",
    value: InstrumentName.PIANO,
  },
  {
    label: "electric piano",
    value: InstrumentName.EPIANO,
  },
  {
    label: "nylon guitar",
    value: InstrumentName.NYLON_GUITAR,
  },
  // {
  //   label: "electric guitar",
  //   value: InstrumentName.ELECTRIC_GUITAR,
  // },
  {
    label: "mandolin",
    value: InstrumentName.MANDOLIN,
  },
  {
    label: "wave synth",
    value: InstrumentName.WAVE_SYNTH,
  },
];

type HarmonizerLayoutProps = {
  name: string;
  setSettings: (prevSettings: HarmonizerSettings) => void;
  setProcess: (prevProcess: string) => void;
};

const HarmonizerLayout = ({ name, setSettings, setProcess }: HarmonizerLayoutProps) => {
  const [styleIndex, setStyleIndex] = useState(0);
  const [timeSigIndex, setTimeSigIndex] = useState(0);
  const [complexityIndex, setComplexityIndex] = useState(2);
  const [instrumentIndex, setInstrumentIndex] = useState(0);
  const [groovinessIndex, setGroovinessIndex] = useState(1);

  function handleStyleChange(id: number) {
    setStyleIndex(id);
    CacheAPI.setLocalItem<number>("harmonizerStyleIndex", id);
  }

  function handleTimeSigSelection(id: number) {
    setTimeSigIndex(id);
    CacheAPI.setLocalItem<number>("harmonizerTimeSigIndex", id);
  }

  function handleComplexityChange(id: number) {
    setComplexityIndex(id);
    CacheAPI.setLocalItem<number>("harmonizerComplexityIndex", id);
  }

  function handleInstrumentSelection(id: number) {
    setInstrumentIndex(id);
    CacheAPI.setLocalItem<number>("harmonizerInstrumentIndex", id);
  }

  function handleGroovinessChange(id: number) {
    setGroovinessIndex(id);
    CacheAPI.setLocalItem<number>("harmonizerGroovinessIndex", id);
  }

  useEffect(() => {
    const cacheList = [
      {
        key: "harmonizerStyleIndex",
        setter: (value: number) => {
          setStyleIndex(wrapValue(value, styles.length));
        },
      },
      {
        key: "harmonizerTimeSigIndex",
        setter: (value: number) => {
          setTimeSigIndex(wrapValue(value, timeSigs.length));
        },
      },
      {
        key: "harmonizerComplexityIndex",
        setter: (value: number) => {
          setComplexityIndex(wrapValue(value, complexity.length));
        },
      },
      {
        key: "harmonizerInstrumentIndex",
        setter: (value: number) => {
          setInstrumentIndex(wrapValue(value, instrumentOptions.length));
        },
      },
      {
        key: "harmonizerGroovinessIndex",
        setter: (value: number) => {
          setGroovinessIndex(wrapValue(value, groovinessOptions.length));
        },
      },
    ];

    cacheList.forEach((param) => {
      const cache = CacheAPI.getLocalItem<number>(param.key);
      if (cache === null || typeof cache !== "number") {
        return;
      }
      param.setter(cache);
    });
  }, []);

  useEffect(() => {
    const patternSize = timeSigs[timeSigIndex].value.patternSize;
    const maxSubdiv = timeSigs[timeSigIndex].value.maxSubdiv;
    const instrumentName = instrumentOptions[instrumentIndex].value;
    const [num, den] = timeSigs[timeSigIndex].label.split("/") as [string, string];

    setSettings({
      style: styles[styleIndex],
      patternSize,
      segSizes: timeSigs[timeSigIndex].value.segSizes,
      rhythmicComplexity: complexity[complexityIndex].value as { min: number; max: number },
      maxSubdiv,
      instrumentName,
      groovinessRange: groovinessOptions[groovinessIndex].value as { min: number; max: number },
      timeSignature: { n: parseInt(num), d: parseInt(den) },
    });
  }, [styleIndex, timeSigIndex, complexityIndex, instrumentIndex, groovinessIndex]);

  useEffect(() => {
    setProcess(name);
  });

  return (
    <div className="HarmonizerLayout">
      <h1 className="HarmonizerLayout__label">instrument</h1>
      <SwipeMenu defaultValue={instrumentIndex} className="HarmonizerLayout__swipe-menu" onSwiped={handleInstrumentSelection}>
        {instrumentOptions.map((ts) => (
          <span key={ts.label} className="HarmonizerLayout__swipe-menu__option">
            {ts.label}
          </span>
        ))}
      </SwipeMenu>
      <h1 className="HarmonizerLayout__label">chords</h1>
      <SwipeMenu defaultValue={styleIndex} className="HarmonizerLayout__swipe-menu" onSwiped={handleStyleChange}>
        {styles.map((style) => (
          <span className="HarmonizerLayout__swipe-menu__option" key={style}>
            {style}
          </span>
        ))}
      </SwipeMenu>
      <h1 className="HarmonizerLayout__label">bar</h1>
      <SwipeMenu defaultValue={timeSigIndex} className="HarmonizerLayout__swipe-menu" onSwiped={handleTimeSigSelection}>
        {timeSigs.map((ts) => (
          <span key={ts.label} className="HarmonizerLayout__swipe-menu__option">
            {ts.label}
          </span>
        ))}
      </SwipeMenu>
      <h1 className="HarmonizerLayout__label">rhythm</h1>
      <SwipeMenu defaultValue={complexityIndex} className="HarmonizerLayout__swipe-menu" onSwiped={handleComplexityChange}>
        {complexity.map((ts) => (
          <span key={ts.label} className="HarmonizerLayout__swipe-menu__option">
            {ts.label}
          </span>
        ))}
      </SwipeMenu>
      <h1 className="HarmonizerLayout__label">grooviness</h1>
      <SwipeMenu defaultValue={groovinessIndex} className="HarmonizerLayout__swipe-menu" onSwiped={handleGroovinessChange}>
        {groovinessOptions.map((ts) => (
          <span key={ts.label} className="HarmonizerLayout__swipe-menu__option">
            {ts.label}
          </span>
        ))}
      </SwipeMenu>
    </div>
  );
};

export default HarmonizerLayout;
