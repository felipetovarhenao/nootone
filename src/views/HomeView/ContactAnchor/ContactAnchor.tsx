import "./ContactAnchor.scss";
import { Ref, forwardRef } from "react";
import AnchorSection from "../../../layouts/AnchorSection/AnchorSection";
import EmailListForm from "../../../layouts/EmailListForm/EmailListForm";

const ContactAnchor = forwardRef(({}, ref: Ref<HTMLDivElement>) => {
  return (
    <AnchorSection ref={ref} className="ContactAnchor" id="contact" header="receive updates!">
      <div className="ContactAnchor__container">
        <EmailListForm />
        <div className="ContactAnchor__container__text">
          <p className="ContactAnchor__container__text__p">Sign up to our email list!</p>
          <p className="ContactAnchor__container__text__p">Keep up with the latest features!</p>
        </div>
      </div>
    </AnchorSection>
  );
});

export default ContactAnchor;
