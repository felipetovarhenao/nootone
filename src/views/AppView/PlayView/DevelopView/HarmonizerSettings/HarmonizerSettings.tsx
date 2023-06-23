import "./HarmonizerSettings.scss";
import NoteHarmonizer from "../../../../../utils/NoteHarmonizer";
import SwipeMenu from "../../../../../components/SwipeMenu/SwipeMenu";
import { useEffect, useState } from "react";
import { HarmonizerSettings as NoteHarmonizerSettings } from "../../../../../redux/recordings/harmonizerThunk";
import { InstrumentName } from "../../../../../types/music";
import CacheAPI from "../../../../../utils/CacheAPI";

const styles = Object.keys(NoteHarmonizer.CHORD_COLLECTIONS);

const timeSigs = [
  {
    label: "2/4",
    value: {
      segSizes: [2, 4],
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
    label: "simple",
    value: [1, 4],
  },
  {
    label: "normal",
    value: [5, 9],
  },
  {
    label: "complex",
    value: [9, 16],
  },
];

const instrumentOptions = [
  {
    label: InstrumentName.PIANO,
    value: InstrumentName.PIANO,
  },
  {
    label: InstrumentName.GUITAR,
    value: InstrumentName.GUITAR,
  },
];

type HarmonizerSettingsProps = {
  name: string;
  setSettings: (prevSettings: NoteHarmonizerSettings) => void;
  setProcess: (prevProcess: string) => void;
};

const HarmonizerSettings = ({ name, setSettings, setProcess }: HarmonizerSettingsProps) => {
  const [styleIndex, setStyleIndex] = useState(0);
  const [timeSigIndex, setTimeSigIndex] = useState(0);
  const [complexityIndex, setComplexityIndex] = useState(0);
  const [instrumentIndex, setInstrumentIndex] = useState(0);

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

  useEffect(() => {
    const cacheList = [
      {
        key: "harmonizerStyleIndex",
        setter: (value: number) => {
          setStyleIndex(value);
        },
      },
      {
        key: "harmonizerTimeSigIndex",
        setter: (value: number) => {
          setTimeSigIndex(value);
        },
      },
      {
        key: "harmonizerComplexityIndex",
        setter: (value: number) => {
          setComplexityIndex(value);
        },
      },
      {
        key: "harmonizerInstrumentIndex",
        setter: (value: number) => {
          setInstrumentIndex(value);
        },
      },
    ];

    cacheList.forEach((param) => {
      const cache = CacheAPI.getLocalItem<number>(param.key);
      if (cache === null) {
        return;
      }
      param.setter(cache);
    });
  }, []);

  useEffect(() => {
    const patternSize = timeSigs[timeSigIndex].value.patternSize;
    const maxSubdiv = timeSigs[timeSigIndex].value.maxSubdiv;
    const instrumentName = instrumentOptions[instrumentIndex].value;
    setSettings({
      style: styles[styleIndex],
      patternSize,
      segSizes: timeSigs[timeSigIndex].value.segSizes,
      numAttacksRange: complexity[complexityIndex].value as [number, number],
      maxSubdiv,
      instrumentName,
    });
  }, [styleIndex, timeSigIndex, complexityIndex, instrumentIndex]);

  useEffect(() => {
    setProcess(name);
  });

  return (
    <div className="HarmonizerSettings">
      <h1 className="HarmonizerSettings__label">chords</h1>
      <SwipeMenu defaultValue={styleIndex} className="HarmonizerSettings__swipe-menu" onSwiped={handleStyleChange}>
        {styles.map((style, i) => (
          <span className="HarmonizerSettings__swipe-menu__option" key={i}>
            {style}
          </span>
        ))}
      </SwipeMenu>
      <h1 className="HarmonizerSettings__label">rhythm</h1>
      <SwipeMenu defaultValue={complexityIndex} className="HarmonizerSettings__swipe-menu" onSwiped={handleComplexityChange}>
        {complexity.map((ts, i) => (
          <span key={i} className="HarmonizerSettings__swipe-menu__option">
            {ts.label}
          </span>
        ))}
      </SwipeMenu>
      <h1 className="HarmonizerSettings__label">bar</h1>
      <SwipeMenu defaultValue={timeSigIndex} className="HarmonizerSettings__swipe-menu" onSwiped={handleTimeSigSelection}>
        {timeSigs.map((ts, i) => (
          <span key={i} className="HarmonizerSettings__swipe-menu__option">
            {ts.label}
          </span>
        ))}
      </SwipeMenu>
      <h1 className="HarmonizerSettings__label">instrument</h1>
      <SwipeMenu defaultValue={instrumentIndex} className="HarmonizerSettings__swipe-menu" onSwiped={handleInstrumentSelection}>
        {instrumentOptions.map((ts, i) => (
          <span key={i} className="HarmonizerSettings__swipe-menu__option">
            {ts.label}
          </span>
        ))}
      </SwipeMenu>
    </div>
  );
};

export default HarmonizerSettings;