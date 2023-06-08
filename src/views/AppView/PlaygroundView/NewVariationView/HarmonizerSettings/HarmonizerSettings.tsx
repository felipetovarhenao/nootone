import "./HarmonizerSettings.scss";
import NoteHarmonizer from "../../../../../utils/NoteHarmonizer";
import SwipeMenu from "../../../../../components/SwipeMenu/SwipeMenu";
import { useEffect, useState } from "react";

const styles = Object.keys(NoteHarmonizer.CHORD_COLLECTIONS);

type HarmonizerSettingsProps = {
  name: string;
  setSettings: (prevSettings: any) => void;
  setProcess: (prevProcess: string) => void;
};
const HarmonizerSettings = ({ name, setProcess, setSettings }: HarmonizerSettingsProps) => {
  const [style, setStyle] = useState("");

  function handleSwipe(i: number) {
    setStyle(styles[i]);
  }

  useEffect(() => {
    setSettings({
      style: style,
    });
    setProcess(name);
  }, [style]);

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
    </div>
  );
};

export default HarmonizerSettings;
