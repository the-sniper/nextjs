import React, { useContext, useEffect, useState } from "react";
import NotificationsIcon from "@material-ui/icons/Notifications";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import PersonIcon from "@material-ui/icons/Person";
import { Link, NavLink, useHistory, useLocation } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import SwapCallsRoundedIcon from "@material-ui/icons/SwapCallsRounded";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import { LOGO, SITE_NAME } from "../../../Utils";
import HeaderSearch from "./HeaderSearch";
import {
  capitalize,
  handleRedirectInternal,
  useCustomMediaQuery,
} from "../../../common/components";

import AuthContext from "../../../context/auth/authContext";
import AlertContext from "../../../context/alert/alertContext";
import CommonContext from "../../../context/common/commonContext";
import Popover from "@material-ui/core/Popover";
import { Badge, Divider, ListItem, SwipeableDrawer } from "@material-ui/core";
import UserContext from "../../../context/user/userContext";
import { setTheme } from "../../../Utils/theme";
import Popup from "../../organisms/Popup";
import QuickSignup from "../../../views/Signup/QuickSignup";
import BidHistory from "../../../components/organisms/BidHistory";
import csc from "country-state-city";
import { useRouter } from "next/router";

const Header = () => {
  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const router = useRouter();
  const headerParams = router.search;

  const [anchorEl, setAnchorEl] = useState(null);
  const {
    loadUser,
    allLogin,
    user,
    saveMarketingSource,
    isAuthenticated,
    logout,
  } = useContext(AuthContext);
  const {
    getAllCategories,
    getAllSellers,
    loaderSet,
    setAllCountries,
    setUSState,
  } = useContext(CommonContext);
  const { setAlert } = useContext(AlertContext);
  const { buynow_cart_items, getCheckout, getBuynowCheckout } =
    useContext(UserContext);
  const [themeClass, setThemeClass] = useState("light");
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [state, setState] = useState({
    top: false,
    right: false,
  });
  const history = useHistory();
  let theme = typeof window !== "undefined" && localStorage.getItem("theme");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (router, path) => {
    setAnchorEl(null);
    if (router && path && path !== "backdropClick") {
      router.push(`/${path}`);
    }
  };

  const toggleDrawer = (anchor, open) => (event) => {
    setState({ ...state, [anchor]: open });
  };

  const handleLogoutClick = () => {
    logout();
    setAlert("Logged out successfully", "success");
    handleRedirectInternal(router, "");
  };

  const [notifAnchor, setNotifAnchor] = useState(null);
  const [sellerAnchor, setSellerAnchor] = useState(null);
  const [cartAnchor, setCartAnchor] = useState(null);
  const [loginAnchor, setLoginAnchor] = useState(null);

  const handleNotificationClick = (event) => {
    setNotifAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotifAnchor(null);
  };

  const handleSellerClick = (event) => {
    setSellerAnchor(event.currentTarget);
  };

  const handleSellerClose = () => {
    setSellerAnchor(null);
  };

  const handleCartClick = (event) => {
    setCartAnchor(event.currentTarget);
  };

  const handleCartClose = () => {
    setCartAnchor(null);
  };

  const handleLoginClick = (event) => {
    setLoginAnchor(event.currentTarget);
  };

  const handleLoginClose = () => {
    setLoginAnchor(null);
  };

  const handleSwitchUser = (email, site_id) => {
    setLoginAnchor(null);
    logout();
    handleRedirectInternal(history, `autologin/${email}/${site_id}`);
  };
  const notifOpen = Boolean(notifAnchor);
  const sellerOpen = Boolean(sellerAnchor);
  const cartOpen = Boolean(cartAnchor);
  const id = notifOpen ? "simple-popover" : undefined;

  useEffect(() => {
    if (isAuthenticated && Object.keys(user).length > 0) {
      if (!user.country || !user.state || !user.city || !user.address1) {
        handleRedirectInternal(history, "verified");
      } else if (router.pathname === "/verified") {
        handleRedirectInternal(history, "");
      }
    }
  }, [user, router.pathname]);

  useEffect(() => {
    const utm_source = new URLSearchParams(headerParams).get("utm_source");
    const utm_medium = new URLSearchParams(headerParams).get("utm_medium");
    const utm_campaign = new URLSearchParams(headerParams).get("utm_campaign");
    if (utm_source) {
      saveMarketingSource({
        utm_source,
        utm_medium,
        utm_campaign,
      });
      handleRedirectInternal(history, "");
    }
  }, [headerParams]);

  // useEffect(() => {
  //   if (!sessionStorage.getItem("quickSignUp") && !isAuthenticated) {
  //     setPopupOpen(true);
  //     sessionStorage.setItem("quickSignUp", true);
  //   }
  // }, []);

  const changeTheme = () => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("theme") === "theme-dark") {
        setTheme("theme-light");
        setThemeClass("light");
      } else {
        setTheme("theme-dark");
        setThemeClass("dark");
      }
    }
  };

  useEffect(() => {
    if (localStorage.getItem("theme") === "theme-dark") {
      setThemeClass("dark");
    } else if (localStorage.getItem("theme") === "theme-light") {
      setThemeClass("light");
    }
  }, [theme]);

  useEffect(() => {
    if (localStorage.token) {
      loadUser(localStorage.token);
    } else {
      loaderSet(false);
    }
    getAllCategories();
    getAllSellers();
    const USStates = [];
    const allCountries = csc.getAllCountries().map((ele) => {
      return { value: ele.id, show: ele.name };
    });
    csc.getStatesOfCountry("231").map((lot) => {
      USStates.push({ value: lot.name, show: lot.name });
    });
    setAllCountries(allCountries);
    setUSState(USStates);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      getCheckout({ user_id: user.id });
      getBuynowCheckout({ user_id: user.id });
    }
  }, [user]);

  return (
    <>
      {useCustomMediaQuery("(min-width: 1024px)") ? (
        <>
          {/* DESKTOP NAVIGATION */}
          <header
            className={`header ${
              typeof window !== "undefined" &&
              router.pathname === "/" &&
              "homeHeader"
            }`}
          >
            {/* {!isAuthenticated && (
          <div className="main-header">
            <div className="customContainer">
              <nav className="navbar nav-bar-main navbar-expand-md">
                <div className="contact-no">
                  <a href="tel: +19722005516">Contact Us! +1-972-200-5516</a>
                </div>
                <div className="main-header-list">
                  <ul>
                    {isAuthenticated ? (
                      <>
                        <li>
                          <NavLink to="/">Sell</NavLink>
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <NavLink to="/signup">Register</NavLink>
                        </li>
                        <li>
                          {" "}
                          <NavLink to="/login">Sign-In</NavLink>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </nav>
            </div>
          </div>
        )} */}
            <div className="customContainer">
              <nav className="navbar nav-bar-main nav-bar-main-section navbar-expand-md">
                <div className="auction-logo">
                  <Link to="/">
                    <img src={LOGO} alt={SITE_NAME} />
                  </Link>
                </div>
                {typeof window !== "undefined" &&
                router.pathname === "/search" ? (
                  ""
                ) : (
                  <div className="ml-3 mr-auto">
                    <HeaderSearch />
                  </div>
                )}
                <div className="main-nav-list">
                  <ul>
                    <li>
                      <Button
                        onClick={() =>
                          handleRedirectInternal(history, "searchAuction")
                        }
                      >
                        <span className="material-icons-round nav-icons">
                          menu_book
                        </span>
                        Auctions
                      </Button>
                    </li>
                    <li>
                      <Button
                        onClick={() =>
                          window.open("https://app.auction.io/login?plan=1")
                        }
                        className="toggleTheme"
                      >
                        <span className="material-icons-round nav-icons">
                          storefront
                        </span>
                        Want to sell?
                      </Button>
                    </li>
                    <li>
                      <Button
                        onClick={() =>
                          handleRedirectInternal(history, "events")
                        }
                      >
                        <span className="material-icons-round nav-icons">
                          local_activity
                        </span>
                        Events
                      </Button>
                    </li>
                    <li>
                      <Button
                        onClick={() =>
                          window.open("https://seller.auction.io/#pricingTable")
                        }
                        className="toggleTheme"
                      >
                        <span className="material-icons-round nav-icons">
                          ballot
                        </span>
                        See Pricing
                      </Button>
                    </li>
                    {/* {!isAuthenticated && (
                  <li>
                    <a href="tel: +19722005516">Contact Us: +1-972-200-5516</a>
                  </li>
                )} */}
                    {!isAuthenticated && (
                      <>
                        <li>
                          <NavLink to="/login">Sign-In</NavLink>
                        </li>
                        {/* <li>
                      <NavLink to="/signup">Register</NavLink>
                    </li> */}
                      </>
                    )}
                    {!isAuthenticated && (
                      <li>
                        <Button
                          aria-describedby={id}
                          onClick={handleSellerClick}
                        >
                          Register
                          <span className="material-icons">expand_more</span>
                        </Button>
                        <Popover
                          id={id}
                          open={sellerOpen}
                          anchorEl={sellerAnchor}
                          onClose={handleSellerClose}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                          }}
                        >
                          {/* {!isAuthenticated && ( */}
                          <MenuItem onClick={() => history.push("/signup")}>
                            Register as a buyer
                          </MenuItem>
                          {/* )} */}
                          <MenuItem
                            onClick={() =>
                              window.open("https://app.auction.io/login?plan=1")
                            }
                          >
                            Register as a seller
                          </MenuItem>
                        </Popover>
                      </li>
                    )}

                    {/* <li>
                  <NavLink to='/'>Home</NavLink>
                </li>
                <li>
                  <NavLink to='/searchAuction?auctionType=1'>Calendar</NavLink>
                </li>
                <li>
                  <NavLink to='/search'>Search</NavLink>
                </li> */}

                    {isAuthenticated ? (
                      <>
                        {/* <li>
                      <Button
                        aria-describedby={id}
                        onClick={handleNotificationClick}
                      >
                        <NotificationsIcon className="nav-icons" />
                      </Button>
                      <Popover
                        id={id}
                        open={notifOpen}
                        anchorEl={notifAnchor}
                        onClose={handleNotificationClose}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                      >
                        <div className="notificationMenu">
                          <ul className="notificationItem">
                            <Button className="clearNotif">
                              Clear all notifications
                            </Button>
                            {dummyNotifications.map((data, index) => (
                              <ListItem button key={index}>
                                <img src={data.img} alt={data.title} />
                                <div className="notifContent">
                                  <h4>{data.title}</h4>
                                  <h5>{data.message}</h5>
                                  <h6>
                                    {data.new && (
                                      <span className="newNotif">New</span>
                                    )}
                                    {data.time}
                                  </h6>
                                </div>
                              </ListItem>
                            ))}
                          </ul>
                        </div>
                      </Popover>
                    </li> */}
                        {allLogin?.length ? (
                          <li>
                            <Tooltip title="Switch User">
                              <Button
                                aria-controls="simple-menu"
                                aria-haspopup="true"
                                onClick={handleLoginClick}
                              >
                                <SwapCallsRoundedIcon className="nav-icons" />
                              </Button>
                            </Tooltip>
                            <Popover
                              id="simple-menu"
                              anchorEl={loginAnchor}
                              keepMounted
                              open={Boolean(loginAnchor)}
                              onClose={handleLoginClose}
                              anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right",
                              }}
                              transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                              }}
                            >
                              {allLogin.map((val) => (
                                <MenuItem
                                  onClick={() =>
                                    handleSwitchUser(val.email, val.site_id)
                                  }
                                >
                                  {val.store_name}
                                </MenuItem>
                              ))}
                            </Popover>
                          </li>
                        ) : null}
                        <li>
                          <Button
                            aria-describedby={id}
                            onClick={() =>
                              handleRedirectInternal(history, "checkout/buynow")
                            }
                          >
                            <Badge
                              badgeContent={buynow_cart_items.length}
                              color="primary"
                            >
                              <ShoppingCartIcon className="nav-icons" />
                            </Badge>
                          </Button>
                          {/* <Popover
                            id={id}
                            open={cartOpen}
                            anchorEl={cartAnchor}
                            onClose={handleCartClose}
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "right",
                            }}
                            transformOrigin={{
                              vertical: "top",
                              horizontal: "right",
                            }}
                          >
                            <MenuItem
                              onClick={() => {
                                setCartAnchor(null);
                                handleRedirectInternal(history, "cart");
                              }}
                            >
                              Cart
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                setCartAnchor(null);
                                handleRedirectInternal(history, "cart/buynow");
                              }}
                            >
                              Buynow Cart
                            </MenuItem>
                          </Popover> */}
                        </li>

                        <li>
                          <Button
                            aria-controls="simple-menu"
                            aria-haspopup="true"
                            onClick={handleClick}
                            className="profile-button"
                          >
                            <PersonIcon className="nav-icons " />
                            {capitalize(user.first_name)}
                          </Button>
                          <Popover
                            id="simple-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "right",
                            }}
                            transformOrigin={{
                              vertical: "top",
                              horizontal: "right",
                            }}
                          >
                            <MenuItem
                              onClick={() => handleClose(history, "profile")}
                            >
                              Profile
                            </MenuItem>
                            <MenuItem
                              onClick={() => handleClose(history, "watchlist")}
                            >
                              Watchlist
                            </MenuItem>
                            <MenuItem
                              onClick={() =>
                                handleClose(history, "my_bids?s=0")
                              }
                            >
                              My Bids
                            </MenuItem>
                            <MenuItem
                              onClick={(e) => {
                                handleClose();
                                handleLogoutClick();
                              }}
                            >
                              Logout
                            </MenuItem>
                          </Popover>
                        </li>
                      </>
                    ) : (
                      ""
                    )}
                  </ul>
                </div>
              </nav>
            </div>
          </header>

          <Popup
            open={isPopupOpen}
            size="lg"
            className="signupModal"
            handleClose={() => setPopupOpen(false)}
            modaltitle=""
          >
            <QuickSignup setPopupOpen={setPopupOpen} />
          </Popup>
        </>
      ) : (
        <>
          {/* MOBILE / TAB NAVIGATION */}
          <header className="mainHeader mobHeader customContainer d-flex justify-content-between align-items-center">
            <div className="headLt d-flex justify-content-start">
              <Link to="/">
                <img src={LOGO} alt={SITE_NAME} />
              </Link>
            </div>
            <div className="headRt">
              <ul className="d-flex justify-content-start ml-auto align-items-center">
                <li className="headCart">
                  <Button
                    className="respNavBtn"
                    onClick={toggleDrawer("top", true)}
                  >
                    <span className="material-icons">search</span>
                  </Button>
                </li>
                {isAuthenticated && (
                  <li className="headCart">
                    <Button
                      className="respNavBtn"
                      onClick={() => handleRedirectInternal(history, "cart")}
                    >
                      <Badge color="primary" badgeContent={0}>
                        <span className="material-icons">shopping_cart</span>
                      </Badge>
                    </Button>
                  </li>
                )}
                <li className="headCart">
                  <Button
                    className="respNavBtn"
                    onClick={toggleDrawer("right", true)}
                  >
                    <span className="material-icons">menu</span>
                  </Button>
                </li>
              </ul>
            </div>
          </header>
          <React.Fragment>
            <SwipeableDrawer
              className="respHeaderSearch"
              anchor={"top"}
              open={state["top"]}
              disableBackdropTransition={!iOS}
              disableDiscovery={iOS}
              disableSwipeToOpen={false}
              onClose={toggleDrawer("top", false)}
              onOpen={toggleDrawer("top", true)}
            >
              <HeaderSearch />
            </SwipeableDrawer>
          </React.Fragment>
          <React.Fragment>
            <SwipeableDrawer
              className="headerDrawer"
              anchor={"right"}
              open={state["right"]}
              disableBackdropTransition={!iOS}
              disableDiscovery={iOS}
              disableSwipeToOpen={false}
              onClose={toggleDrawer("right", false)}
              onOpen={toggleDrawer("right", true)}
            >
              <div className="headRt respNav d-flex justify-content-start align-items-center">
                <div className="naLogoHead d-flex justify-content-between align-items-center">
                  <Link to="/">
                    <img src={LOGO} alt={SITE_NAME} />
                  </Link>
                  <Button
                    className="headDrawerClose"
                    onClick={toggleDrawer("right", false)}
                  >
                    <span className="material-icons">clear</span>
                  </Button>
                </div>
                <Divider />
                <ul
                  className="navRespLinks"
                  onClick={toggleDrawer("right", false)}
                >
                  <ListItem button>
                    <NavLink activeClassName="active" to="/" exact>
                      <span class="material-icons">home</span> Home
                    </NavLink>
                  </ListItem>
                  <ListItem button>
                    <NavLink activeClassName="active" to="/searchAuction" exact>
                      <span className="material-icons">event</span> Calendar
                    </NavLink>
                  </ListItem>
                  {isAuthenticated && (
                    <>
                      <ListItem button>
                        <NavLink activeClassName="active" to="/profile" exact>
                          <span className="material-icons">person</span> Profile
                        </NavLink>
                      </ListItem>
                      <ListItem button>
                        <NavLink activeClassName="active" to="/watchlist" exact>
                          <span className="material-icons">favorite</span>{" "}
                          Watchlist
                        </NavLink>
                      </ListItem>
                      <ListItem button>
                        <NavLink
                          activeClassName="active"
                          to="/my_bids?s=0"
                          exact
                        >
                          <span className="material-icons">gavel</span> My Bids
                        </NavLink>
                      </ListItem>
                      <ListItem button>
                        <NavLink
                          activeClassName="active"
                          to="/saved_search"
                          exact
                        >
                          <span className="material-icons">bookmarks</span>{" "}
                          Saved Searches
                        </NavLink>
                      </ListItem>
                      <ListItem button>
                        <NavLink activeClassName="active" to="/my_orders" exact>
                          <span className="material-icons">receipt</span> My
                          Orders
                        </NavLink>
                      </ListItem>
                      <ListItem button>
                        <NavLink
                          activeClassName="active"
                          to="/notifications"
                          exact
                        >
                          <span className="material-icons">notifications</span>{" "}
                          My Notifications
                        </NavLink>
                      </ListItem>
                    </>
                  )}

                  <ListItem button onClick={changeTheme}>
                    <span className="material-icons">
                      {themeClass === "light" ? "dark_mode" : "light_mode"}
                    </span>
                    Change Theme
                  </ListItem>

                  <ListItem
                    button
                    onClick={() =>
                      window.open("https://app.auction.io/login?plan=1")
                    }
                  >
                    <span className="material-icons">storefront</span>
                    Want to sell?
                  </ListItem>

                  <ListItem
                    button
                    onClick={() =>
                      window.open("https://seller.auction.io/#pricingTable")
                    }
                  >
                    <span className="material-icons">ballot</span>
                    See Pricing
                  </ListItem>

                  {isAuthenticated ? (
                    <ListItem button onClick={handleLogoutClick}>
                      <span className="material-icons">power_settings_new</span>
                      Logout
                    </ListItem>
                  ) : (
                    <>
                      <ListItem button>
                        <NavLink activeClassName="active" to="/login" exact>
                          <span className="material-icons">login</span>
                          Sign-in
                        </NavLink>
                      </ListItem>
                      <ListItem button>
                        <NavLink activeClassName="active" to="/signup" exact>
                          <span className="material-icons">person_add</span>
                          Register
                        </NavLink>
                      </ListItem>
                    </>
                  )}
                </ul>
              </div>
            </SwipeableDrawer>
          </React.Fragment>
        </>
      )}
      <BidHistory />
    </>
  );
};

export default Header;
