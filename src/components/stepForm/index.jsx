import React, { useState, useMemo, useCallback } from "react";
import styles from "./stepForm.module.css";
import Apple from "components/icons/apple";
import Facebook from "components/icons/fb";
import Google from "components/icons/google";
import { useFormik } from "formik";
import * as Yup from "yup";
import Back from "components/icons/back";

const REGISTER_STEP = {
  EMAIL_STEP: 1,
  INFO_STEP: 2,
  SUCCESS_STEP: 3,
};

function StepForm(props) {
  const [currentStep, setCurrentStep] = useState(REGISTER_STEP.EMAIL_STEP);

  const validationEmail = useFormik({
    initialValues: {
      email: "",
    },

    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email format").required("Required!"),
    }),

    onSubmit: (values) => {
      // step 1: call Api and verify email
      // step 2: nếu thành công thì  chuyển sang step tiếp theo
      // step 2: nếu thất bại => hiển thị lỗi
      // setCurrentStep(REGISTER_STEP.INFO_STEP);
      setCurrentStep((step) => step + 1);
    },
  });

  const validationInfo = useFormik({
    initialValues: {
      name: "",
      password: "",
    },

    validationSchema: Yup.object({
      name: Yup.string()
        .min(6, "Mininum 6 characters")
        .max(16, "Maximum 16 characters")
        .required("Name Required!"),
      password: Yup.string()
        .min(6, "Minimum 6 characters")
        .max(16, "Maximum 16 characters")
        .required("Password Required!"),
    }),

    onSubmit: (values) => {
      const { name, password } = values;

      const data = {
        name,
        password,
        email: validationEmail.values.email,
      };

      console.log("««««« Call API with value »»»»»", data);

      setCurrentStep(REGISTER_STEP.SUCCESS_STEP);
    },
  });

  const buttonContent = useMemo(() => {
    switch (currentStep) {
      case REGISTER_STEP.EMAIL_STEP:
        return "Continue";

      case REGISTER_STEP.INFO_STEP:
        return "Agree and continue";

      default:
        return "Next step";
    }
  }, [currentStep]);

  const onClickButton = useCallback(
    (e) => {
      e.preventDefault();

      if (currentStep === REGISTER_STEP.EMAIL_STEP) {
        validationEmail.handleSubmit();
      }

      if (currentStep === REGISTER_STEP.INFO_STEP) {
        validationInfo.handleSubmit();
      }
    },
    [currentStep, validationEmail, validationInfo]
  );

  const onBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((step) => step - 1);
    }
  }, [currentStep]);

  const getTitle = useMemo(() => {
    switch (currentStep) {
      case REGISTER_STEP.EMAIL_STEP:
        return <h2>Hi! </h2>;

      case REGISTER_STEP.INFO_STEP:
        return <h2>Sign up</h2>;

      default:
        return;
    }
  }, [currentStep]);

  const isErrorEmail = useMemo(() => {
    if (validationEmail.errors?.email && validationEmail.touched?.email) {
      return true;
    }
    return false;
  }, [validationEmail.errors?.email, validationEmail.touched?.email]);

  const isErrorInfo = (fieldName) => {
    if (validationInfo.errors[fieldName] && validationInfo.touched[fieldName]) {
      return true;
    }
    return false;
  };

  return (
    <main className={`${styles.formSignin} w-100 m-auto`}>
      <div className={styles.back} onClick={onBack}>
        <Back />
      </div>

      {getTitle}

      {currentStep === REGISTER_STEP.EMAIL_STEP && (
        <div className={styles.coverForm}>
          <div className={`mb-3 mt-3 form-floating ${styles.coverEmail}`}>
            <input
              type="text"
              className={`form-control ${isErrorEmail ? "is-invalid" : ""} ${
                styles.email
              }`}
              id="email"
              placeholder="Email:"
              name="email"
              value={validationEmail.values.email}
              onChange={validationEmail.handleChange}
              onBlur={validationEmail.handleBlur}
            />

            <label htmlFor="email">Email:</label>

            {isErrorEmail && (
              <div className={styles.invalidFeedback}>
                {validationEmail.errors?.email}
              </div>
            )}
          </div>

          <button
            type="submit"
            className={`btn btn-primary ${styles.button}`}
            onClick={onClickButton}
          >
            {buttonContent}
          </button>

          <div className={styles.or}>or</div>

          <button
            type="submit"
            className={`btn btn-primary ${styles.buttonOther}`}
            onClick={onClickButton}
          >
            <div className={styles.icon}>
              <Facebook />
            </div>{" "}
            Continue with Facebook
          </button>

          <button
            type="submit"
            className={`btn btn-primary ${styles.buttonOther}`}
            onClick={onClickButton}
          >
            <div className={styles.icon}>
              <Google />
            </div>{" "}
            Continue with Google
          </button>

          <button
            type="submit"
            className={`btn btn-primary ${styles.buttonOther}`}
            onClick={onClickButton}
          >
            <div className={styles.icon}>
              <Apple />
            </div>{" "}
            Continue with Apple
          </button>

          <div className={styles.coverSignUp}>
            Don't have an account?{" "}
            <a className={styles.signUp} href="#">
              Sign up
            </a>
          </div>
          <div className={styles.coverSignUp}>
            <a className={styles.signUp} href="#">
              Forgot your password?
            </a>
          </div>
        </div>
      )}

      {currentStep === REGISTER_STEP.INFO_STEP && (
        <div className={styles.coverForm}>
          <div className= {styles.coverSignUp}>
            Looks like you don't have an account. <br />
            Let's create a new account for <br />
            <span className={styles.valueOfEmail}>{validationEmail.values.email}</span>
          </div>

          <div className={`mb-3 mt-3 form-floating ${styles.coverEmail}`}>
            <input
              type="text"
              className={`form-control ${
                isErrorInfo("name") ? "is-invalid" : ""
              } ${styles.email}`}
              id="name"
              placeholder="Name:"
              name="name"
              value={validationInfo.values.name}
              onChange={validationInfo.handleChange}
              onBlur={validationInfo.handleBlur}
            />

            <label htmlFor="name">Name:</label>

            {isErrorInfo("name") && (
              <div className={styles.invalidFeedback}>
                {validationInfo.errors?.name}
              </div>
            )}
          </div>

          <div className={`mb-3 mt-3 form-floating ${styles.coverEmail}`}>
            <input
              type="password"
              className={`form-control ${
                isErrorInfo("password") ? "is-invalid" : ""
              } ${styles.email}`}
              id="password"
              placeholder="Password:"
              name="password"
              value={validationInfo.values.password}
              onChange={validationInfo.handleChange}
              onBlur={validationInfo.handleBlur}
            />

            <label htmlFor="password">Password:</label>

            {isErrorInfo("password") && (
              <div className={styles.invalidFeedback}>
                {validationInfo.errors?.password}
              </div>
            )}
          </div>

          <div className={styles.coverSignUp}>
            By selecting Agree and continue below, <br /> I agree to <a href="#" className={styles.signUp}>Term of Service</a> and <a href="#" className={styles.signUp}>Privacy Policy</a>
          </div>

          <button
            type="submit"
            className={`btn btn-primary ${styles.button}`}
            onClick={onClickButton}
          >
            {buttonContent}
          </button>
        </div>
      )}

      {currentStep === REGISTER_STEP.SUCCESS_STEP && (
        <div className={styles.coverFormSuccess}>
          <h1>Register Success!!!</h1>
        </div>
      )}
    </main>
  );
}

export default StepForm;
