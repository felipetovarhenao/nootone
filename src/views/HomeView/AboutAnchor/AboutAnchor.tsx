import "./AboutAnchor.scss";
import { Ref, forwardRef, useState } from "react";
import AnchorSection from "../../../layouts/AnchorSection/AnchorSection";
import Button from "../../../components/Button/Button";
import Icon from "../../../components/Icon/Icon";
import icons from "../../../utils/icons";
import CONFIG from "../../../utils/config";
import useAnalyticsEventTracker, { EventName } from "../../../hooks/useAnalyticsEventTracker";

const AboutAnchor = forwardRef(({}, ref: Ref<HTMLDivElement>) => {
  const [showVideo, setShowVideo] = useState(false);
  const eventTracker = useAnalyticsEventTracker();
  return (
    <AnchorSection ref={ref} className="AboutAnchor" header="A smart music sketchbook app">
      <h2 className="AboutAnchor__subtitle">
        record and develop your ideas, <b>easily</b>, <b>anywhere</b>, in <b>seconds</b>.
      </h2>
      <div className="AboutAnchor__container">
        <div className="AboutAnchor__container__left">
          <div className="AboutAnchor__container__left__text">
            <p className="AboutAnchor__container__left__text__p">watch how easy it is to create an accompaniment 🎹</p>
            <p className="AboutAnchor__container__left__text__p">make music to match your melodies! 🎙</p>
          </div>
          <Button
            className="AboutAnchor__container__left__button"
            onClick={() => {
              eventTracker(EventName.START_APP);
              window.open(`${CONFIG.origin}/#/app`);
            }}
          >
            <Icon icon={icons.lab} />
            try the app
          </Button>
        </div>
        <div className="AboutAnchor__container__right">
          {!showVideo ? (
            <div
              className="AboutAnchor__container__right__image-container"
              onClick={() => {
                setShowVideo(true);
              }}
            >
              <img
                className="AboutAnchor__container__right__image-container__image"
                src={"https://dxbtnxd6vjk30.cloudfront.net/images/app-screenshot.png"}
                alt="app screenshot"
              />
              <div className="AboutAnchor__container__right__image-container__overlay">
                <Icon className="AboutAnchor__container__right__image-container__overlay__icon" icon={icons.play} />
              </div>
            </div>
          ) : (
            <video autoPlay={showVideo} className="AboutAnchor__container__right__video" controls>
              <source src={"https://dxbtnxd6vjk30.cloudfront.net/videos/demo-v3.mp4"} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      </div>
    </AnchorSection>
  );
});

export default AboutAnchor;
