import "./FeedbackForm.scss";
import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import Button from "../../components/Button/Button";

// Define the validation schema using Yup
const bugReportSchema = Yup.object().shape({
  reply_to: Yup.string().email("Invalid email").required("Email is required"),
  message: Yup.string().required("Comments are required"),
  contact: Yup.boolean().required("Contact consent is required"),
});

type FeedbackForm = {
  reply_to: string;
  message: string;
  contact: boolean;
};
const FeedbackForm: React.FC = () => {
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  const form = useRef<HTMLFormElement>(null);
  const initialValues = {
    reply_to: "",
    message: "",
    contact: false,
  };

  const handleSubmit = async (_: FeedbackForm, { setSubmitting }: FormikHelpers<FeedbackForm>) => {
    // Handle form submission
    setSubmitting(true);

    try {
      await emailjs.sendForm("service_1upcmpo", "template_tnmwsnu", form.current!, "LfEBEM1_26WPFsCHp");
      setSubmitStatus("success");
    } catch (error) {
      setSubmitStatus("error");
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="FeedbackForm">
      <h2 className="FeedbackForm__header">Help us improve!</h2>

      {submitStatus !== "success" ? (
        <>
          <Formik
            validateOnBlur={false}
            validateOnChange={false}
            initialValues={initialValues}
            validationSchema={bugReportSchema}
            onSubmit={handleSubmit}
          >
            {(formik) => {
              return (
                <Form className="FeedbackForm__form" ref={form}>
                  <Field className="FeedbackForm__form__input" placeholder="contact email" type="email" id="email" name="reply_to" />
                  <Field
                    className="FeedbackForm__form__textarea"
                    placeholder="tell us what you think 🙂"
                    as="textarea"
                    id="comments"
                    name="message"
                  />
                  <ErrorMessage className="FeedbackForm__form__error" name="reply_to" component="div" />
                  <ErrorMessage className="FeedbackForm__form__error" name="message" component="div" />
                  <div className="FeedbackForm__form__checkbox-container">
                    <label htmlFor="contact">Is it ok to contact you?</label>
                    <Field className="FeedbackForm__form__checkbox-container__checkbox" type="checkbox" name="contact" />
                    <ErrorMessage name="contact" component="div" className="error" />
                  </div>
                  <Button disabled={formik.isSubmitting} className="FeedbackForm__form__submit" type="submit">
                    submit
                  </Button>
                </Form>
              );
            }}
          </Formik>
          {submitStatus === "error" && (
            <span className="FeedbackForm__status --danger">
              We were unable to send your feedback 😕. Please check your connexion or come back later.
            </span>
          )}
        </>
      ) : (
        <span className="FeedbackForm__status --success">Thank you for your feedback!</span>
      )}
    </div>
  );
};

export default FeedbackForm;

export function getBrowserAndDeviceDetails(): { browser: string; device: string } {
  const userAgent = navigator.userAgent;

  // Check for browser
  let browser = "Unknown";
  if (userAgent.indexOf("Firefox") > -1) {
    browser = "Mozilla Firefox";
  } else if (userAgent.indexOf("Chrome") > -1) {
    browser = "Google Chrome";
  } else if (userAgent.indexOf("Safari") > -1) {
    browser = "Apple Safari";
  } else if (userAgent.indexOf("Opera") > -1) {
    browser = "Opera";
  } else if (userAgent.indexOf("Edge") > -1) {
    browser = "Microsoft Edge";
  } else if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident/") > -1) {
    browser = "Internet Explorer";
  }

  // Check for device
  let device = "Unknown";

  if (userAgent.match(/Tablet/i)) {
    device = "Tablet Device";
  } else if (userAgent.match(/iPad/i)) {
    device = "iPad";
  } else if (userAgent.match(/iPhone/i)) {
    device = "iPhone";
  } else if (userAgent.match(/Android/i)) {
    device = "Android Device";
  } else if (userAgent.match(/Windows/i)) {
    device = "Windows PC";
  } else if (userAgent.match(/Macintosh/i)) {
    device = "Macintosh";
  } else if (userAgent.match(/Linux/i)) {
    device = "Linux PC";
  }

  return {
    browser,
    device,
  };
}
