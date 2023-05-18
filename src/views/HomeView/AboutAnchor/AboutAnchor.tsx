import "./AboutAnchor.scss";

import { Ref, forwardRef } from "react";

import AnchorSection from "../../../layouts/AnchorSection/AnchorSection";
import AppName from "../../../components/AppName/AppName";

const AboutAnchor = forwardRef(({}, ref: Ref<HTMLDivElement>) => {
  return (
    <AnchorSection id="about" className="anchor" header={"About"} ref={ref}>
      <AppName /> is a <b>smart music sketchbook</b> that helps you capture and develop your ideas in <b>seconds</b>.
      <br />
      <br />
      If you're interested, stay tuned. <b>More coming soon!</b>
    </AnchorSection>
  );
});

export default AboutAnchor;
