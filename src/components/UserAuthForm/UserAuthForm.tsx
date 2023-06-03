import cn from "classnames";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "../Button/Button";

type LoginForm = {
  username: string;
  password: string;
};

type RegistrationForm = LoginForm & {
  email: string;
  confirmation: string;
};

type UserFormProps = {
  onLogin?: (formData: LoginForm) => Promise<any> | void;
  onRegistration?: (formData: RegistrationForm) => Promise<any> | void;
  className?: string;
  isRegistration?: boolean;
};

const UserAuthForm = ({ className, onRegistration = () => {}, onLogin = () => {}, isRegistration = false }: UserFormProps) => {
  const initialValues: RegistrationForm = {
    username: "",
    password: "",
    email: "",
    confirmation: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("username is required").matches(/^\S*$/, "username cannot contain spaces"),
    password: Yup.string().required("password is required"),
    email: isRegistration ? Yup.string().email("invalid email").required("email is required") : Yup.string().email("invalid email"),
    confirmation: isRegistration
      ? Yup.string()
          .oneOf([Yup.ref("password")], "passwords must match")
          .required("confirmation password is required")
      : Yup.string(),
  });

  const handleSubmit = (values: RegistrationForm, helpers: any) => {
    if (isRegistration) {
      onRegistration(values)?.then(() => helpers.resetForm());
    } else {
      const { username, password } = values;
      onLogin({ username, password })?.then(() => helpers.resetForm());
    }
  };

  return (
    <Formik validateOnBlur={false} validateOnChange={false} initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      <Form className={cn(className, "UserAuthForm")}>
        <Field autoFocus name="username" type="text" placeholder="username" />
        {isRegistration && <Field name="email" type="email" placeholder="email" />}
        <Field name="password" type="password" placeholder="password" />
        {isRegistration && <Field name="confirmation" type="password" placeholder="confirmation password" />}
        <ErrorMessage className="error" name="username" component="div" />
        <ErrorMessage className="error" name="email" component="div" />
        <ErrorMessage className="error" name="password" component="div" />
        <ErrorMessage className="error" name="confirmation" component="div" />
        <Button type="submit">{isRegistration ? "register" : "log in"}</Button>
      </Form>
    </Formik>
  );
};

export default UserAuthForm;
