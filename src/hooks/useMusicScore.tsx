import { RefObject, useEffect, useRef, useState } from "react";
import { SymbolicMusicSequence } from "../types/music";
import ScoreRenderer from "../utils/abcjs/ScoreRenderer";
import { renderAbc, AbcVisualParams, TimingCallbacks, AnimationOptions } from "abcjs";
import { useAppSelector } from "../redux/hooks";
import { useReactToPrint } from "react-to-print";

const useMusicScore = (defaultOptions: MusicScoreOptions = defaultMusicScoreOptions): MusicScoreHelpers => {
  const scoreRef = useRef<HTMLDivElement | null>(null);
  const [musicSequence, setMusicSequence] = useState<SymbolicMusicSequence | null>(null);
  const timingCallbacks = useRef<TimingCallbacks | null>(null);
  const [options, setOptions] = useState<MusicScoreOptions>(defaultOptions);

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

    const visualObject = renderAbc(scoreRef.current, score, options.renderingOptions)[0];

    timingCallbacks.current = new TimingCallbacks(visualObject, options.callbackOptions);
  }, [musicSequence, options]);

  function getTimingCallbacks() {
    return timingCallbacks.current as TimingCallbacks;
  }

  return {
    printScore,
    scoreRef,
    setMusicSequence,
    setOptions,
    getTimingCallbacks,
  };
};

type MusicScoreHelpers = {
  scoreRef: RefObject<HTMLDivElement>;
  printScore: () => void;
  getTimingCallbacks: () => TimingCallbacks;
  setOptions: (options: MusicScoreOptions) => void;
  setMusicSequence: (musicSequence: SymbolicMusicSequence | null) => void;
};

type MusicScoreOptions = {
  renderingOptions?: AbcVisualParams;
  callbackOptions?: AnimationOptions;
};

const defaultMusicScoreOptions: MusicScoreOptions = {
  renderingOptions: {
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
  },
  callbackOptions: {
    eventCallback: (event) => {
      if (!event) {
        return;
      }
      event.elements.forEach((elem) => {
        const g = (elem as unknown as [HTMLElement])[0];
        g.style.setProperty("fill", "var(--primary-3)");
        setTimeout(() => {
          g.style.setProperty("fill", "black");
        }, 250);
      });
    },
  },
};

export default useMusicScore;
