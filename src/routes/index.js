import React, { useEffect, useContext, Suspense, useState } from "react";
import {
  Route,
  BrowserRouter as Router,
  withRouter,
  Switch,
} from "react-router-dom";
// import PrivateRoute from "./privateRoute";
import Header from "../components/organisms/Header";
import Footer from "../components/organisms/Footer";
import { useRouter } from "next/router";
import CommonContext from "../context/common/commonContext";
import AuthContext from "../context/auth/authContext";

import csc from "country-state-city";
import UserContext from "../context/user/userContext";
import Loaders from "../components/molecules/Loaders";
import PrivateRoute from "./privateRoute";
import CarAuctions from "../views/Search/CarAuctions";
import Cars from "../views/Cars";
import { socket } from "../common/socket";
import OurTeam from "../views/Team";
import TemplatePreview from "../views/Plugins/Marketing/TemplatePreview";
import ListCard from "../views/Dashboard/Cards";

const Search = React.lazy(() => import("../views/Search"));
const Home = React.lazy(() => import("../views/Home"));
const Login = React.lazy(() => import("../views/Login"));
const Signup = React.lazy(() => import("../views/Signup"));
const Verified = React.lazy(() => import("../views/Signup/verified"));
const ProductView = React.lazy(() => import("../views/ProductView"));
const AuctionView = React.lazy(() => import("../views/AuctionView"));
const Cart = React.lazy(() => import("../views/Cart"));
const BuynowCart = React.lazy(() => import("../views/BuynowCart"));
const Checkout = React.lazy(() => import("../views/Checkout"));

const CheckoutBuyNow = React.lazy(() =>
  import("../views/Checkout/indexBuyNow")
);
const Profile = React.lazy(() => import("../views/Dashboard/Profile"));
const Watchlist = React.lazy(() => import("../views/Dashboard/Watchlist"));
const MyBids = React.lazy(() => import("../views/Dashboard/MyBids"));
const SavedSearch = React.lazy(() => import("../views/Dashboard/SavedSearch"));
const Notifications = React.lazy(() =>
  import("../views/Dashboard/Notifications")
);
const Mytickets = React.lazy(() => import("../views/Dashboard/mytickets"));
const MyOrders = React.lazy(() => import("../views/Dashboard/MyOrders"));

const LiveLots = React.lazy(() => import("../views/LiveLots"));
const SearchAuction = React.lazy(() => import("../views/SearchAuction"));

const ForgotPassword = React.lazy(() => import("../views/ForgotPassword"));
const ResetPassword = React.lazy(() =>
  import("../views/ForgotPassword/ResetPassword")
);
const Reviews = React.lazy(() => import("../views/Reviews/Reviews"));
const Invoice = React.lazy(() => import("../views/Invoice"));
const LiveLotView = React.lazy(() => import("../views/LiveLotView"));
const Liquidation = React.lazy(() => import("../views/Liquidation"));
const Ticketing = React.lazy(() => import("../views/Ticketing"));
const TicketingStatus = React.lazy(() => import("../views/TicketingStatus"));
const Auctioneer = React.lazy(() => import("../views/Auctioneer"));
const Privacy = React.lazy(() => import("../views/Static/Privacy"));
const Terms = React.lazy(() => import("../views/Static/Terms"));
const PluginsView = React.lazy(() => import("../views/PluginsView"));
const AuctionSeller = React.lazy(() => import("../views/AuctionSeller"));
const DemoRequest = React.lazy(() => import("../views/DemoRequest"));
const Marketing = React.lazy(() => import("../views/Plugins/Marketing"));
const Videos = React.lazy(() => import("../views/Videos"));
const VideosView = React.lazy(() => import("../views/Videos/VideosView"));
const marketing_demo = React.lazy(() =>
  import("../views/Plugins/Marketing_demo")
);
const Routes = (props) => {
  const [userIn, setUserin] = useState(false);

  useEffect(() => {
    if (props.location.pathname.includes("liveLots")) {
      // console.log("Im in");
      setUserin(true);
      socket.emit("userWatch", "userConnected");
    } else {
      if (userIn === true) {
        // console.log("Im out");
        setUserin(false);
        socket.emit("userWatch", "userDisconnected");
      }
    }
  }, [props.location.pathname]);
  const router = useRouter();

  return (
    <>
      <Header />
      <Suspense
        fallback={
          <div className="fallbackLoader">
            {typeof window !== "undefined" &&
            localStorage.getItem("theme") === "theme-dark" ? (
              <img src="/assets/images/loader-dark.gif" alt="loader" />
            ) : (
              <img src="/assets/images/loader-light.gif" alt="loader" />
            )}
          </div>
        }
      >
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/search" component={Search} />
          <Route exact path="/login/:activationId?" component={Login} />
          <Route exact path="/auto-login/:login_email" component={Login} />
          <Route
            exact
            path="/autologin/:login_email/:site_id"
            component={Login}
          />
          <Route
            exact
            path="/search/auto-login/:login_email"
            component={Login}
          />
          <Route
            exact
            path="/search/autologin/:login_email"
            component={Login}
          />
          <Route exact path="/autologin/:login_email" component={Login} />
          <Route exact path="/verified" component={Verified} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/productView" component={ProductView} />
          <Route
            exact
            path="/lotview/:auctionId/:lotId/:userId"
            component={LiveLotView}
          />
          <Route exact path="/auctionView" component={AuctionView} />
          <Route exact path="/reviews" component={Reviews} />
          <Route exact path="/liveLots" component={LiveLots} />
          <Route exact path="/searchAuction" component={SearchAuction} />
          <Route exact path="/events" component={SearchAuction} />
          <Route exact path="/forgot_password" component={ForgotPassword} />
          <Route exact path="/reset_password" component={ResetPassword} />
          <Route exact path="/car_auction" component={CarAuctions} />
          <Route exact path="/vijaytv/videos" component={Videos} />
          <Route exact path="/videosview/:type" component={VideosView} />
          <PrivateRoute exact path="/cart" component={Cart} />
          <PrivateRoute exact path="/cart/buynow" component={BuynowCart} />
          <PrivateRoute exact path="/checkout/:type" component={Checkout} />
          <PrivateRoute exact path="/profile" component={Profile} />
          <PrivateRoute exact path="/watchlist" component={Watchlist} />
          <PrivateRoute exact path="/my_bids" component={MyBids} />
          <PrivateRoute exact path="/saved_search" component={SavedSearch} />
          {/* <PrivateRoute exact path="/saved_cards" component={ListCard} /> */}
          <PrivateRoute exact path="/notifications" component={Notifications} />
          <PrivateRoute exact path="/mytickets" component={Mytickets} />
          <PrivateRoute exact path="/my_orders" component={MyOrders} />
          <PrivateRoute exact path="/invoice/:id" component={Invoice} />
          {/* <PrivateRoute
            exact
            path="/checkout/:type"
            component={CheckoutBuyNow}
          /> */}
          <Route exact path="/ticketing/:sid/:aid" component={Ticketing} />
          <Route
            exact
            path="/ticketstatus/:sid/:aid"
            component={TicketingStatus}
          />
          <Route exact path="/privacy" component={Privacy} />
          <Route exact path="/terms" component={Terms} />
          <Route exact path="/cars" component={Cars} />
          <Route exact path="/liquidation" component={Liquidation} />
          <Route exact path="/auctioneer" component={Auctioneer} />
          <Route exact path="/saas" component={AuctionSeller} />
          <Route exact path="/plugin" component={PluginsView} />
          <Route exact path="/auctions-demo-request" component={DemoRequest} />
          <Route exact path="/ourTeam" component={OurTeam} />
          <Route exact path="/template_preview" component={TemplatePreview} />
          <Route
            exact
            path="/plugins/marketing/:user_id/:site_id"
            component={marketing_demo}
          />
          <Route
            exact
            path="/plugins/marketing_old/:user_id/:site_id"
            component={Marketing}
          />
        </Switch>
      </Suspense>
      {(typeof window !== "undefined" &&
        router.pathname.indexOf("/ticketing")) != 0 &&
      (typeof window !== "undefined" &&
        router.pathname.indexOf("/ticketstatus")) != 0 ? (
        <Footer />
      ) : (
        ""
      )}
    </>
  );
};
export default withRouter(Routes);
