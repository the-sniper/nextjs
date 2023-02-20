import { Divider } from "@material-ui/core";
import React, { useState, useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { LOGO, SITE_NAME } from "../../Utils";
import PrimaryButton from "../../components/atoms/PrimaryButton";
import { useFormik } from "formik";
import * as Yup from "yup";
import UserContext from "../../context/user/userContext";
import { mapData, handleRedirectInternal } from "../../common/components";
import AlertContext from "../../context/alert/alertContext";

function ForgotPassword() {
  const { verifyEmail, sendEmailVerifyLink } = useContext(UserContext);
  const { setAlert } = useContext(AlertContext);
  const history = useHistory();

  const loginValidationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .max(250, "250 characters max")
      .required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      const success = await verifyEmail(values);
      if (success) {
        const payload = {
          ...values,
          redirectURL: `${window.location.origin}/reset_password`,
        };
        const verificationLink = await sendEmailVerifyLink(payload);
        if (verificationLink) {
          setAlert("Email Sent Successfully", "success");
          handleRedirectInternal(history, "");
        } else {
          setAlert("An Error Occured, Please Try Again Later", "error");
        }
      } else {
        setAlert("Email does not exist in our system", "error");
      }
    },
  });

  const loginInfo = [
    {
      label: "Email address",
      name: "email",
      type: "email",
      placeholder: "Enter your email address",
      class: "col-12",
      autoFocus: true,
      formik: formik,
    },
  ];

  return (
    <div className="login">
      <Link to="/">
        <img className="brandLogo" src={LOGO} alt={SITE_NAME} />
      </Link>
      <h2>Forgot Password</h2>
      <h4>Send Reset Password Link to your email</h4>
      <form onSubmit={formik.handleSubmit}>
        <div className="row">{Object.values(mapData(loginInfo))}</div>
        <div className="loginActBox">
          <PrimaryButton label="Send" type="submit" />
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;
