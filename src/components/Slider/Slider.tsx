import "./Slider.scss";
import { HTMLAttributes } from "react";

interface SliderProps extends HTMLAttributes<HTMLInputElement> {
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
  name?: string;
  inMin?: number;
  inMax?: number;
  outMin?: number;
  outMax?: number;
  unit?: string;
  step?: number;
}

function scaleValue(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  const scaled = ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
  return Math.round(scaled * 100) / 100;
}

export default function Slider({
  name,
  value,
  setValue,
  inMin = 0,
  inMax = 100,
  outMin = 0.0,
  outMax = 1.0,
  step = 1,
  unit = "",
  ...rest
}: SliderProps) {
  return (
    <div className="slider-container">
      <input
        className="slider"
        name={name}
        type="range"
        min={0}
        max={1000}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        step={step}
        {...rest}
      />
      <span className="value-display">{`${scaleValue(value, inMin, inMax, outMin, outMax)}${unit}`}</span>
    </div>
  );
}
