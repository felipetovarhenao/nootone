import { RefObject, useEffect, useRef, useState } from "react";
import { SymbolicMusicSequence } from "../types/music";
import ScoreRenderer from "../utils/abcjs/ScoreRenderer";
import { renderAbc, AbcVisualParams, TimingCallbacks, AnimationOptions } from "abcjs";
import { useAppSelector } from "../redux/hooks";
import { useReactToPrint } from "react-to-print";

type MusicScoreHelpers = {
  printScore: () => void;
  scoreRef: RefObject<HTMLDivElement>;
  getTimingCallbacks: () => TimingCallbacks;
  setMusicSequence: (musicSequence: SymbolicMusicSequence | null) => void;
};

const useMusicScore = (options?: AbcVisualParams, callbackOptions?: AnimationOptions): MusicScoreHelpers => {
  const scoreRef = useRef<HTMLDivElement | null>(null);
  const [musicSequence, setMusicSequence] = useState<SymbolicMusicSequence | null>(null);
  const timingCallbacks = useRef<TimingCallbacks | null>(null);

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

    let abcConfig: AbcVisualParams = options || {
      selectionColor: "var(--txt-dark)",
      oneSvgPerLine: true,
      print: true,
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

    const visualObject = renderAbc(scoreRef.current, score, abcConfig)[0];

    timingCallbacks.current = new TimingCallbacks(visualObject, {
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
      ...callbackOptions,
    });
  }, [musicSequence, options, callbackOptions]);

  function getTimingCallbacks() {
    return timingCallbacks.current as TimingCallbacks;
  }

  return {
    printScore,
    scoreRef,
    setMusicSequence,
    getTimingCallbacks,
  };
};

export default useMusicScore;
