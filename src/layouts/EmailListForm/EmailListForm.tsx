import "./EmailListForm.scss";
import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { Formik, Field, Form, ErrorMessage, FormikHelpers } from "formik";
import * as yup from "yup";
import Button from "../../components/Button/Button";

const schema = yup.object().shape({
  from_name: yup.string().required("Name is required"),
  reply_to: yup.string().email("Invalid email").required("Email is required"),
  message: yup.string(),
  contact: yup.boolean(),
  testing: yup.boolean(),
});

interface emailForm {
  from_name: string;
  reply_to: string;
  message: string;
  contact: boolean;
  testing: boolean;
}

const initialValues: emailForm = {
  from_name: "",
  reply_to: "",
  message: "",
  contact: false,
  testing: false,
};

export const EmailListForm: React.FC = () => {
  const form = useRef<HTMLFormElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState("");

  const sendEmail = async (_: emailForm, { resetForm }: FormikHelpers<emailForm>) => {
    try {
      setSubmitting(true);
      setSubmitError(null);

      await emailjs.sendForm("service_1upcmpo", "template_8jap597", form.current!, "LfEBEM1_26WPFsCHp");

      resetForm();
      setSuccess("Thanks for signing up!🫶");
      setTimeout(() => {
        setSuccess("");
      }, 5000);
    } catch (error) {
      setSubmitError("Failed to send email. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={schema} onSubmit={sendEmail}>
      <Form className="EmailListForm" ref={form}>
        {success && <p className="EmailListForm__success-message">{success}</p>}
        <Field type="text" name="from_name" placeholder="full name" />
        <ErrorMessage className="error" name="from_name" component="p" />

        <Field type="email" name="reply_to" placeholder="email" />
        <ErrorMessage className="error" name="reply_to" component="p" />

        <Field type="text" name="message" placeholder="message (optional)" as="textarea" />
        <ErrorMessage className="error" name="message" component="p" />

        <div className="EmailListForm__checkbox-container">
          <Field className="EmailListForm__checkbox-container__checkbox" type="checkbox" name="contact" />
          <label htmlFor="contact">I consent to receive future emails about nootone</label>
          <ErrorMessage name="contact" component="div" className="error" />
        </div>

        <div className="EmailListForm__checkbox-container">
          <Field className="EmailListForm__checkbox-container__checkbox" type="checkbox" name="testing" />
          <label htmlFor="volunteer">I want to sign up for beta testing</label>
          <ErrorMessage name="testing" component="div" className="error" />
        </div>

        {submitError && <p>{submitError}</p>}

        <Button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Sign up!"}
        </Button>
      </Form>
    </Formik>
  );
};

export default EmailListForm;
