import "./Metronome.scss";
import { useEffect, useRef } from "react";
import getResponsiveCanvasContext from "../../utils/getResponsiveCanvasContext";
import cn from "classnames";
import * as Tone from "tone";

/**
 * Metronome component that displays a visual metronome using a canvas element.
 *
 * @param tempo - The tempo of the metronome in beats per minute.
 * @param canvasDims - Optional object specifying the width and height of the canvas element.
 * @param className - Optional class name for the component.
 */
type MetronomeProps = {
  tempo: number;
  canvasDims?: { width: number; height: number };
  className?: string;
  padding?: number;
  onClick?: () => void;
};
const Metronome = ({ tempo, canvasDims = { width: 40, height: 40 }, className, onClick, padding = 0 }: MetronomeProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    // Sets up the canvas and animation when the component mounts.
    if (!canvasRef.current) {
      return;
    }
    contextRef.current = getResponsiveCanvasContext(canvasRef.current);

    // Calculates the initial offset based on the current time.

    // Schedules a repeating animation loop using Tone.Transport.
    Tone.Transport.scheduleRepeat(function (time) {
      if (canvasRef.current !== null && contextRef.current !== null) {
        Tone.Draw.schedule(() => {
          if (!contextRef.current) {
            return;
          }
          const beatDuration = 60 / Tone.Transport.bpm.value;

          // Calculates the alpha (transparency) value based on the elapsed time and beat duration.
          const alpha = 1 - ((time / beatDuration) % 1);
          const theta = (alpha * 0.1 + 0.9) ** 1.1;

          // Clears the canvas and draws a circle with varying transparency.
          contextRef.current.clearRect(0, 0, canvasDims.width, canvasDims.height);
          contextRef.current.beginPath();
          contextRef.current.arc(canvasDims.width / 2, canvasDims.height / 2, (canvasDims.height / 2 - padding) * theta, 0, 2 * Math.PI);
          contextRef.current.closePath();

          const fillStyle = `rgba(217,100,119,${alpha})`;
          contextRef.current.fillStyle = fillStyle;
          contextRef.current.fill();
        }, time);
      }
    }, 0.043); // Animation frame rate approximately 23 frames per second (1000ms / 23 frames ≈ 0.043ms) NOTE: A low frame rate is necessary to avoid metronome lags in mobile devices

    // Starts Tone and Tone.Transport when the component mounts
    // Tone.start().then(() => Tone.Transport.start());
    Tone.Transport.start();
    // Cleans up and stops the Tone.Transport when the component unmounts.
    return () => {
      Tone.Transport.stop();
    };
  }, []);

  useEffect(() => {
    // Updates the tempo value in the Tone.Transport when the tempo prop changes.
    Tone.Transport.bpm.value = tempo;
  }, [tempo]);

  return <canvas onClick={onClick} className={cn(className, "Metronome")} ref={canvasRef} width={canvasDims.width} height={canvasDims.height} />;
};

export default Metronome;
