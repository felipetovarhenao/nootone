import { useState, useEffect } from "react";

const useDeviceWidth = (): number => {
  const [deviceId, setDeviceId] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let id = 0;

      if (width < 480) {
        id = 0;
      } else if (width < 768) {
        id = 1;
      } else if (width < 1024) {
        id = 2;
      } else if (width < 1440) {
        id = 3;
      } else {
        id = 4;
      }

      setDeviceId(id);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return deviceId;
};

export default useDeviceWidth;
