import { Divider } from "@material-ui/core";
import React, { useState, useEffect, useContext } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { LOGO, SITE_NAME } from "../../Utils";
import PrimaryButton from "../../components/atoms/PrimaryButton";
import { useFormik } from "formik";
import * as Yup from "yup";
import AuthContext from "../../context/auth/authContext";
import { mapData, handleRedirectInternal } from "../../common/components";
import AlertContext from "../../context/alert/alertContext";
import Loaders from "../../components/molecules/Loaders";

function Login(props) {
  const {
    login,
    responseStatus,
    clearResponse,
    isAuthenticated,
    activateAccount,
  } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const history = useHistory();
  const { login_email, site_id } = useParams();
  const [load, setLoad] = useState(false);
  const [loading, setLoading] = useState(false);

  const accountActivator = async () => {
    const res = await activateAccount({ id: props.match.params.activationId });
    if (res) {
      setAlert("Account Activated Successfully", "success");
    } else {
      setAlert("Account Activated Failed", "error");
    }
    handleRedirectInternal(history, "login");
  };

  useEffect(() => {
    if (props.match.params.activationId) {
      accountActivator();
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      handleRedirectInternal(history, "searchAuction");
    }
  }, [isAuthenticated]);

  const loginValidationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .max(250, "250 characters max")
      .required("Required"),
    password: Yup.string().min(6, "Minimum 6 characters").required("Required"),
  });

  let [passwordShown, setPasswordShown] = useState(false);

  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  useEffect(() => {
    if (responseStatus) {
      if (responseStatus.from === "login") {
        if (responseStatus.status === "success") {
          handleRedirectInternal(history, "searchAuction");
          setAlert("Logged In Successfully", "success");
          clearResponse();
        } else if (responseStatus.status === "error") {
          setAlert(responseStatus.message, "error");
          clearResponse();
        }
      }
    }
  }, [responseStatus]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      community: "auction_io",
      is_auctionio: 1,
    },
    validationSchema: loginValidationSchema,
    onSubmit: (values) => {
      login(values);
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
    {
      label: "Password",
      name: "password",
      type: passwordShown ? "text" : "password",
      placeholder: "Enter your password",
      class: "col-12",
      formik: formik,
      endAdornment: passwordShown ? (
        <span
          className="material-icons cursorPointer"
          onClick={togglePasswordVisiblity}
        >
          visibility_off
        </span>
      ) : (
        <span
          className="material-icons cursorPointer"
          onClick={togglePasswordVisiblity}
        >
          visibility
        </span>
      ),
    },
  ];

  useEffect(() => {
    // console.log("login_email", login_email);
    if (
      window.location.pathname.includes("/autologin") ||
      window.location.pathname.includes("/auto-login")
    ) {
      setLoad(true);
      setLoading(true);
      let email = login_email;
      let password = "12";
      let autologin = 1;
      let encrypt = window.location.pathname.includes("/auto-login") ? 1 : 0;
      let loginValues = {
        email: email,
        password: password,
        autologin: autologin,
        encrypt: encrypt,
        site_id,
      };
      // console.log("loginvalues", loginValues);
      if (!isAuthenticated) {
        login(loginValues);
      }
    }
  }, []);

  return loading ? (
    <Loaders name="home" isLoading={loading} />
  ) : (
    <div className="login">
      <Link to="/">
        <img className="brandLogo" src={LOGO} alt={SITE_NAME} />
      </Link>
      <h2>Welcome to Auction.io</h2>
      <h4>Continue logging to your account</h4>
      <form onSubmit={formik.handleSubmit}>
        <div className="row">{Object.values(mapData(loginInfo))}</div>
        <div className="loginActBox">
          <PrimaryButton label="login" type="submit" />
        </div>
      </form>
      <Divider />
      <div className="loginMiscAction d-flex justify-content-between align-items-center">
        <Link to="/forgot_password">Forgot password ?</Link>
        <Link to="/signup">Create a new account ?</Link>
      </div>
    </div>
  );
}

export default Login;
