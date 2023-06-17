import "./HarmonizerSettings.scss";
import NoteHarmonizer from "../../../../../utils/NoteHarmonizer";
import SwipeMenu from "../../../../../components/SwipeMenu/SwipeMenu";
import { useEffect, useState } from "react";
import randomChoice from "../../../../../utils/randomChoice";
import getRandomNumber from "../../../../../utils/getRandomNumber";

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
    label: "6/8",
    value: {
      segSizes: [2],
      patternSize: 2,
      maxSubdiv: 3,
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
    value: [1, 3],
  },
  {
    label: "moderate",
    value: [4, 9],
  },
  {
    label: "dense",
    value: [9, 16],
  },
];

type HarmonizerSettingsProps = {
  name: string;
  setSettings: (prevSettings: any) => void;
  setProcess: (prevProcess: string) => void;
};
const HarmonizerSettings = ({ name, setSettings, setProcess }: HarmonizerSettingsProps) => {
  const [styleIndex, setStyleIndex] = useState(0);
  const [timeSigIndex, setTimeSigIndex] = useState(0);
  const [complexityIndex, setComplexityIndex] = useState(0);

  function handleStyleChange(id: number) {
    setStyleIndex(id);
    localStorage.setItem("harmonizerStyleIndex", String(id));
  }

  function handleTimeSigSelection(id: number) {
    setTimeSigIndex(id);
    localStorage.setItem("harmonizerTimeSigIndex", String(id));
  }

  function handleComplexityChange(id: number) {
    setComplexityIndex(id);
    localStorage.setItem("harmonizerComplexityIndex", String(id));
  }

  useEffect(() => {
    const cacheList = [
      {
        key: "harmonizerStyleIndex",
        setter: (value: string) => {
          const val = parseInt(value);
          if (val < 0 || val >= styles.length) {
            return;
          }
          setStyleIndex(val);
        },
      },
      {
        key: "harmonizerTimeSigIndex",
        setter: (value: string) => {
          const val = parseInt(value);
          if (val < 0 || val >= timeSigs.length) {
            return;
          }
          setTimeSigIndex(val);
        },
      },
      {
        key: "harmonizerComplexityIndex",
        setter: (value: string) => {
          const val = parseInt(value);
          if (val < 0 || val >= timeSigs.length) {
            return;
          }
          setComplexityIndex(val);
        },
      },
    ];

    cacheList.forEach((param) => {
      const cache = localStorage.getItem(param.key);
      if (!cache) {
        return;
      }
      param.setter(cache);
    });
  }, []);

  useEffect(() => {
    const patternSize = timeSigs[timeSigIndex].value.patternSize;
    const segSize = randomChoice(timeSigs[timeSigIndex].value.segSizes);
    const numAttacks = getRandomNumber(...(complexity[complexityIndex].value as [number, number]));
    const maxSubdiv = timeSigs[timeSigIndex].value.maxSubdiv;
    setSettings({
      style: styles[styleIndex],
      patternSize,
      segSize,
      numAttacks,
      maxSubdiv,
    });
  }, [styleIndex, timeSigIndex, complexityIndex]);

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
    </div>
  );
};

export default HarmonizerSettings;
