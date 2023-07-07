import "./MainAnchor.scss";
import { Ref, forwardRef, useState } from "react";
import AnchorSection from "../../../layouts/AnchorSection/AnchorSection";
import Button from "../../../components/Button/Button";
import Icon from "../../../components/Icon/Icon";
import icons from "../../../utils/icons";

const MainAnchor = forwardRef(({}, ref: Ref<HTMLDivElement>) => {
  const [showVideo, setShowVideo] = useState(false);
  return (
    <AnchorSection ref={ref} className="MainAnchor" header="A smart music sketchbook app">
      <h2 className="MainAnchor__subtitle">
        record and develop your ideas, <b>easily</b>, <b>anywhere</b>, in <b>seconds</b>.
      </h2>
      <div className="MainAnchor__container">
        <div className="MainAnchor__container__left">
          <div className="MainAnchor__container__left__text">
            <p className="MainAnchor__container__left__text__p">watch how easy it is to create an accompaniment 🎹</p>
            <p className="MainAnchor__container__left__text__p">make music to match your melodies! 🎙</p>
          </div>
          <Button className="MainAnchor__container__left__button" onClick={() => window.open("http://nootone.io/#/app")}>
            <Icon icon={icons.lab} />
            try the app
          </Button>
        </div>
        <div className="MainAnchor__container__right">
          {!showVideo ? (
            <img
              className="MainAnchor__container__right__image"
              src={"https://dxbtnxd6vjk30.cloudfront.net/images/app-screenshot.png"}
              alt="app screenshot"
            />
          ) : (
            <video autoPlay={showVideo} className="MainAnchor__container__right__video" controls>
              <source src={"https://dxbtnxd6vjk30.cloudfront.net/videos/demo-v3.mp4"} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          <Button
            onClick={() => {
              setShowVideo(true);
            }}
            className="MainAnchor__container__right__button"
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
