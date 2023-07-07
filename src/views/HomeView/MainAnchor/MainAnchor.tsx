import "./MainAnchor.scss";
import { Ref, forwardRef, useRef, useState } from "react";
import AnchorSection from "../../../layouts/AnchorSection/AnchorSection";
import Button from "../../../components/Button/Button";
import Icon from "../../../components/Icon/Icon";
import icons from "../../../utils/icons";

const MainAnchor = forwardRef(({}, ref: Ref<HTMLDivElement>) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showVideo, setShowVideo] = useState(false);
  return (
    <AnchorSection ref={ref} className="MainAnchor" header="A smart music sketchbook app">
      <h2 className="MainAnchor__subtitle">
        record and develop your ideas, <b>easily</b>, <b>anywhere</b>, in <b>seconds</b>.
      </h2>
      <div className="MainAnchor__content">
        <div className="MainAnchor__content__text">
          <p>watch how easy it is to create an accompaniment 🎹</p>
          <p>make music to match your melodies! 🎙</p>
          <Button onClick={() => window.open("http://nootone.io/#/app")} className="MainAnchor__content__button">
            <Icon icon={icons.lab} />
            try the app
          </Button>
        </div>
        <div className="MainAnchor__app-screenshot">
          {!showVideo ? (
            <img
              className="MainAnchor__app-screenshot__image"
              src={"https://dxbtnxd6vjk30.cloudfront.net/images/app-screenshot.png"}
              alt="app screenshot"
            />
          ) : (
            <video ref={videoRef} autoPlay={showVideo} className="MainAnchor__app-screenshot__image" controls>
              <source src={"https://dxbtnxd6vjk30.cloudfront.net/videos/demo-v3.mp4"} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          <Button
            onClick={() => {
              setShowVideo(true);
              // videoRef.current?.play();
            }}
            className="MainAnchor__app-screenshot__button"
            disabled={showVideo}
          >
            watch
          </Button>
        </div>
      </div>
    </AnchorSection>
  );
});

export default MainAnchor;
