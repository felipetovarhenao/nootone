import "./HarmonizerSettings.scss";
import NoteHarmonizer from "../../../../../utils/NoteHarmonizer";
import SwipeMenu from "../../../../../components/SwipeMenu/SwipeMenu";
import { useEffect, useState } from "react";

const styles = Object.keys(NoteHarmonizer.CHORD_COLLECTIONS);

const timeSigs = [
  {
    label: "2/4",
    value: 2,
  },
  {
    label: "3/4",
    value: 3,
  },
  {
    label: "4/4",
    value: 4,
  },
];

type HarmonizerSettingsProps = {
  name: string;
  setSettings: (prevSettings: any) => void;
  setProcess: (prevProcess: string) => void;
};
const HarmonizerSettings = ({ name, setProcess, setSettings }: HarmonizerSettingsProps) => {
  const [style, setStyle] = useState("");
  const [patternSize, setPatternSize] = useState(-1);

  function handleSwipe(i: number) {
    setStyle(styles[i]);
  }

  useEffect(() => {
    setSettings({
      style: style,
      patternSize: patternSize,
    });
    setProcess(name);
  }, [style, patternSize]);

  function handleTimeSigSelection(id: number) {
    setPatternSize(timeSigs[id].value);
  }

  return (
    <div className="HarmonizerSettings">
      <h1 className="HarmonizerSettings__label">style</h1>
      <SwipeMenu className="HarmonizerSettings__swipe-menu" onSwiped={handleSwipe}>
        {styles.map((style, i) => (
          <span className="HarmonizerSettings__swipe-menu__option" key={i}>
            {style}
          </span>
        ))}
      </SwipeMenu>
      <h1 className="HarmonizerSettings__label">bar</h1>
      <SwipeMenu className="HarmonizerSettings__swipe-menu" onSwiped={handleTimeSigSelection}>
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
