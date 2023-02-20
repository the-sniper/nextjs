import { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "src/routes";
import App from "./_app";
// import App from "../App-old";

function AppContainer() {
  const [showChild, setShowChild] = useState(false);
  useEffect(() => {
    setShowChild(true);
  }, []);
  if (!showChild) {
    return null;
  }
  if (typeof window === "undefined") {
    return null;
  } else {
    return (
      <Router>
        <Routes />
      </Router>
    );
  }
  // return typeof window !== 'undefined' ? <App /> : null;
}

export default AppContainer;
