import "./ContactAnchor.scss";
import { Ref, forwardRef } from "react";
import AnchorSection from "../../../layouts/AnchorSection/AnchorSection";
import EmailListForm from "../../../layouts/EmailListForm/EmailListForm";

const AboutAnchor = forwardRef(({}, ref: Ref<HTMLDivElement>) => {
  return (
    <AnchorSection className="anchor" id="contact" header="receive updates!" ref={ref}>
      If you want to learn more about what we're up to, sign up for our email list!
      <EmailListForm />
    </AnchorSection>
  );
});

export default AboutAnchor;
