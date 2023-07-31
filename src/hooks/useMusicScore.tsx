import { RefObject, useEffect, useRef, useState } from "react";
import { SymbolicMusicSequence } from "../types/music";
import ScoreRenderer from "../utils/abcjs/ScoreRenderer";
import { renderAbc, AbcVisualParams, TimingCallbacks, AnimationOptions } from "abcjs";
import { useAppSelector } from "../redux/hooks";
import { useReactToPrint } from "react-to-print";

const useMusicScore = (): MusicScoreHelpers => {
  const scoreRef = useRef<HTMLDivElement | null>(null);
  const [musicSequence, setMusicSequence] = useState<SymbolicMusicSequence | null>(null);
  const timingCallbacks = useRef<TimingCallbacks | null>(null);
  const [renderingOptions, setRenderingOptions] = useState<RenderingOptions>(defaultRenderingOptions);
  const [callbackOptions, setCallbackOptions] = useState<TimingCallbackOptions>(defaultCallbackOptions);

  const { username } = useAppSelector((state) => state.user);

  const printScore = useReactToPrint({
    content: () => scoreRef.current,
    pageStyle: "@page { margin: 0mm; }",
  });

  useEffect(() => {
    if (!scoreRef.current || !musicSequence) {
      return;
    }
    const renderer = new ScoreRenderer(musicSequence);
    const score = renderer.render({ author: username });

    const visualObject = renderAbc(scoreRef.current, score, renderingOptions)[0];

    timingCallbacks.current = new TimingCallbacks(visualObject, callbackOptions);
  }, [musicSequence, renderingOptions, callbackOptions]);

  function getTimingCallbacks() {
    return timingCallbacks.current as TimingCallbacks;
  }

  return {
    printScore,
    scoreRef,
    setMusicSequence,
    setCallbackOptions,
    setRenderingOptions,
    getTimingCallbacks,
  };
};

type TimingCallbackOptionsSetter = (options: TimingCallbackOptions | ((options: TimingCallbackOptions) => TimingCallbackOptions)) => void;
type RenderingOptionsSetter = (options: RenderingOptions | ((options: RenderingOptions) => RenderingOptions)) => void;
type MusicSequenceSetter = (
  musicSequence: SymbolicMusicSequence | null | ((musicSequence: SymbolicMusicSequence | null) => SymbolicMusicSequence | null)
) => void;

type MusicScoreHelpers = {
  scoreRef: RefObject<HTMLDivElement>;
  printScore: () => void;
  getTimingCallbacks: () => TimingCallbacks;
  setCallbackOptions: TimingCallbackOptionsSetter;
  setRenderingOptions: RenderingOptionsSetter;
  setMusicSequence: MusicSequenceSetter;
};

type RenderingOptions = AbcVisualParams;
type TimingCallbackOptions = AnimationOptions;

const defaultRenderingOptions: RenderingOptions = {
  selectionColor: "var(--txt-dark)",
  oneSvgPerLine: true,
  add_classes: true,
  responsive: "resize",
  staffwidth: 800,
  scrollHorizontal: false,
  viewportHorizontal: false,
  viewportVertical: true,
  wrap: {
    minSpacing: 1,
    maxSpacing: 2,
    preferredMeasuresPerLine: 3,
    minSpacingLimit: 1,
  },
};

const defaultCallbackOptions: TimingCallbackOptions = {
  eventCallback: (event) => {
    if (!event) {
      return;
    }
    event.elements.forEach((elem) => {
      const g = (elem as unknown as [HTMLElement])[0];
      g.style.setProperty("fill", "var(--primary-4)");
      setTimeout(() => {
        g.style.setProperty("fill", "var(--txt)");
      }, 250);
    });
  },
};

export default useMusicScore;
