import { useEffect, useRef, useState } from "react";
import { SymbolicMusicSequence } from "../types/music";
import ScoreRenderer from "../utils/abcjs/ScoreRenderer";
import { renderAbc, AbcVisualParams } from "abcjs";
import { useAppSelector } from "../redux/hooks";
import { useReactToPrint } from "react-to-print";

type useMusicScoreOptions = {
  width?: number;
};

const useMusicScore = (options?: useMusicScoreOptions) => {
  const scoreRef = useRef<HTMLDivElement | null>(null);
  const [musicSequence, setMusicSequence] = useState<SymbolicMusicSequence | null>(null);

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
    const { width = 800 } = options || {};

    let abcConfig: AbcVisualParams = {
      selectionColor: "var(--txt-dark)",
      oneSvgPerLine: true,
      print: true,
      staffwidth: width,
      scrollHorizontal: true,
      viewportHorizontal: true,
      viewportVertical: true,
      wrap: {
        minSpacing: 1,
        maxSpacing: 2,
        preferredMeasuresPerLine: 3,
        minSpacingLimit: 1,
      },
    };

    renderAbc(scoreRef.current, score, abcConfig);
  }, [musicSequence]);

  return {
    printScore,
    scoreRef,
    setMusicSequence,
  };
};

export default useMusicScore;
