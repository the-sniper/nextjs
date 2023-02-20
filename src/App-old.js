import React, { useRef, useEffect } from "react";
import Routes from "./routes";
import { BrowserRouter as Router } from "react-router-dom";
import AuthState from "./context/auth/authState";
import ProductState from "./context/product/productState";
import AuctionState from "./context/auction/auctionState";
import CommonState from "./context/common/commonState";
import AlertState from "./context/alert/alertState";
import Alerts from "./common/alert";
import BuyerState from "./context/buyer/buyerState";
import UserState from "./context/user/userState";
import { SnackbarProvider } from "notistack";
import Button from "@material-ui/core/Button";
import { keepTheme } from "./Utils/theme";
import StripeCardState from "./context/stripe/card/cardState";

global.site_url = process.env.NEXT_PUBLIC_FORWARD_DOMAIN;
global.images_url = process.env.NEXT_PUBLIC_IMAGE_URL;

function App() {
  const notistackRef = useRef();
  const onClickDismiss = (key) => () => {
    notistackRef.current.closeSnackbar(key);
  };

  useEffect(() => {
    keepTheme();
  });

  Number.prototype.toUSFormat = function (n = 2) {
    return this.toLocaleString("en-US", {
      minimumFractionDigits: n,
      maximumFractionDigits: n,
    });
  };
  Array.prototype.move = function (from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
    return this;
  };

  return (
    <CommonState>
      <AuthState>
        <UserState>
          <ProductState>
            <AuctionState>
              <BuyerState>
                <StripeCardState>
                  <AlertState>
                    <SnackbarProvider
                      maxSnack={3}
                      ref={notistackRef}
                      action={(key) => (
                        <Button
                          style={{ color: "#fff" }}
                          onClick={onClickDismiss(key)}
                        >
                          <span className="material-icons">close</span>
                        </Button>
                      )}
                    >
                      <div className="App">
                        <Alerts />
                        <Router>
                          <Routes />
                        </Router>
                      </div>
                    </SnackbarProvider>
                  </AlertState>
                </StripeCardState>
              </BuyerState>
            </AuctionState>
          </ProductState>
        </UserState>
      </AuthState>
    </CommonState>
  );
}

export default App;
