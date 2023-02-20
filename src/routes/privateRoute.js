import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import AuthContext from "../context/auth/authContext";
function PrivateRoute({ component: Component, ...rest }) {
  const authContext = useContext(AuthContext);
  const { token } = authContext;
  return (
    <Route
      {...rest}
      render={(props) =>
        localStorage.token ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/", state: { referer: props.location } }}
          />
        )
      }
    />
  );
}

export default PrivateRoute;
