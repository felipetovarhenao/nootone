import "./HarmonizerSettings.scss";
import NoteHarmonizer from "../../../../../utils/NoteHarmonizer";
import SwipeMenu from "../../../../../components/SwipeMenu/SwipeMenu";
import { useEffect, useState } from "react";
import randomChoice from "../../../../../utils/randomChoice";

const styles = Object.keys(NoteHarmonizer.CHORD_COLLECTIONS);

const timeSigs = [
  {
    label: "2/4",
    value: {
      segSizes: [2, 4],
      patternSize: 2,
    },
  },
  {
    label: "3/4",
    value: {
      segSizes: [3],
      patternSize: 3,
    },
  },
  {
    label: "4/4",
    value: {
      segSizes: [2, 4],
      patternSize: 4,
    },
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

  function handleStyleChange(id: number) {
    setStyleIndex(id);
    localStorage.setItem("harmonizerStyleIndex", String(id));
  }

  function handleTimeSigSelection(id: number) {
    setTimeSigIndex(id);
    localStorage.setItem("harmonizerTimeSigIndex", String(id));
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
    setSettings({
      style: styles[styleIndex],
      patternSize: timeSigs[timeSigIndex].value.patternSize,
      segSize: randomChoice(timeSigs[timeSigIndex].value.segSizes),
    });
  }, [styleIndex, timeSigIndex]);

  useEffect(() => {
    setProcess(name);
  });

  return (
    <div className="HarmonizerSettings">
      <h1 className="HarmonizerSettings__label">style</h1>
      <SwipeMenu defaultValue={styleIndex} className="HarmonizerSettings__swipe-menu" onSwiped={handleStyleChange}>
        {styles.map((style, i) => (
          <span className="HarmonizerSettings__swipe-menu__option" key={i}>
            {style}
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
