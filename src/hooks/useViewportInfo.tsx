import { useState, useEffect } from "react";

interface ViewportInfo {
  dimensions: [number, number];
  orientation: "portrait" | "landscape";
  sizeID: number;
}

/**
 * Custom hook that provides information about the viewport dimensions,
 * orientation, and size ID.
 *
 * @returns {ViewportInfo} The viewport information object.
 */
const useViewportInfo = (): ViewportInfo => {
  const [dimensions, setDimensions] = useState<[number, number]>([0, 0]);
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [sizeID, setSizeID] = useState(0);

  useEffect(() => {
    /**
     * Handler function for the window resize event.
     * Updates the viewport information based on the new dimensions.
     */
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      let widthID, heightID;

      // Determine the width ID based on the width of the viewport
      if (width < 480) {
        widthID = 0;
      } else if (width < 768) {
        widthID = 1;
      } else if (width < 1024) {
        widthID = 2;
      } else if (width < 1440) {
        widthID = 3;
      } else {
        widthID = 4;
      }

      // Determine the height ID based on the height of the viewport
      if (height < 480) {
        heightID = 0;
      } else if (height < 768) {
        heightID = 1;
      } else if (height < 1024) {
        heightID = 2;
      } else if (height < 1440) {
        heightID = 3;
      } else {
        heightID = 4;
      }

      // Update the orientation, size ID, and dimensions state variables
      setOrientation(width < height ? "portrait" : "landscape");
      setSizeID(Math.min(heightID, widthID));
      setDimensions([width, height]);

      // Update CSS variables with viewport units
      window.document.documentElement.style.setProperty("--vh", `${height * 0.01}px`);
      window.document.documentElement.style.setProperty("--vw", `${width * 0.01}px`);
    };

    // Add event listener for window resize and call the handler
    window.addEventListener("resize", handleResize);
    handleResize();

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return {
    dimensions,
    orientation,
    sizeID,
  };
};

export default useViewportInfo;
