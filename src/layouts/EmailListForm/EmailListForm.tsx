import "./EmailListForm.scss";
import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { Formik, Field, Form, ErrorMessage, FormikHelpers } from "formik";
import * as yup from "yup";
import Button from "../../components/Button/Button";

const schema = yup.object().shape({
  from_name: yup.string().required("Name is required"),
  reply_to: yup.string().email("Invalid email").required("Email is required"),
});

interface emailForm {
  from_name: string;
  reply_to: string;
}

export const EmailListForm: React.FC = () => {
  const form = useRef<HTMLFormElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const sendEmail = async (_: emailForm, { resetForm }: FormikHelpers<emailForm>) => {
    try {
      setSubmitting(true);
      setSubmitError(null);

      await emailjs.sendForm("service_1upcmpo", "template_8jap597", form.current!, "LfEBEM1_26WPFsCHp");

      resetForm();
    } catch (error) {
      console.log("Error sending email:", error);
      setSubmitError("Failed to send email. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik initialValues={{ from_name: "", reply_to: "" }} validationSchema={schema} onSubmit={sendEmail}>
      <Form className="EmailListForm" ref={form}>
        <label htmlFor="from_name">First name</label>
        <Field type="text" name="from_name" />
        <ErrorMessage className="error" name="from_name" component="p" />

        <label htmlFor="reply_to">Email</label>
        <Field type="email" name="reply_to" />
        <ErrorMessage className="error" name="reply_to" component="p" />

        {submitError && <p>{submitError}</p>}

        <Button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Sign up!"}
        </Button>
      </Form>
    </Formik>
  );
};

export default EmailListForm;
