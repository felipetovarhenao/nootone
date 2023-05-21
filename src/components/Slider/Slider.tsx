import "./Slider.scss";
import { HTMLAttributes } from "react";

interface SliderProps extends HTMLAttributes<HTMLInputElement> {
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
  name?: string;
  inMin?: number;
  inMax?: number;
  outMin?: number | null;
  outMax?: number | null;
  unit?: string;
  step?: number;
}

function scaleValue(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  const scaled = ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
  return Math.round(scaled * 100) / 100;
}

export default function Slider({ name, value, setValue, inMin = 0, inMax = 100, unit = "", step = 1, outMin, outMax, ...rest }: SliderProps) {
  return (
    <div className="slider-container">
      <input
        className="slider"
        name={name}
        type="range"
        min={inMin}
        max={inMax}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        step={step}
        {...rest}
      />
      <span className="value-display">{`${scaleValue(value, inMin, inMax, outMin || inMin, outMax || inMax)}${unit}`}</span>
    </div>
  );
}
