import "./NewVariationsLayout.scss";
import { useAppSelector } from "../../redux/hooks";
import { useEffect, useRef } from "react";
import WaveSurferPlayer from "../../components/WaveSurferPlayer/WaveSurferPlayer";

const NewVariationsLayout = () => {
  const { keptVariationsBuffer } = useAppSelector((state) => state.recordings);
  const containerRef = useRef<HTMLDivElement | null>(null);

  function handleUpdate() {
    if (containerRef.current === null) {
      return;
    }
    containerRef.current.scrollTo({ top: containerRef.current.scrollHeight, behavior: "smooth" });
  }

  useEffect(() => {
    handleUpdate();
  }, [keptVariationsBuffer.length]);

  return keptVariationsBuffer.length > 0 ? (
    <div className="NewVariationsLayout">
      <h1 className="NewVariationsLayout__label">my new variations ({keptVariationsBuffer.length})</h1>
      <div ref={containerRef} className="NewVariationsLayout__container">
        {keptVariationsBuffer.map((variation, i) => (
          <WaveSurferPlayer className="NewVariationsLayout__container__variation" key={i} rec={variation} />
        ))}
      </div>
    </div>
  ) : (
    <></>
  );
};

export default NewVariationsLayout;
