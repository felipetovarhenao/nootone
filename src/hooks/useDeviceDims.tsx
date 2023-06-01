import { useState, useEffect } from "react";

const useDeviceDims = (): [number, number] => {
  const [deviceDims, setDeviceDims] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setDeviceDims([width, height]);
      window.document.documentElement.style.setProperty("--vh", `${height * 0.01}px`);
      window.document.documentElement.style.setProperty("--vw", `${width * 0.01}px`);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return deviceDims;
};

export default useDeviceDims;
