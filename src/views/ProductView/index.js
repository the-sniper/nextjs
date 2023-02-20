import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from "react";
import { Breadcrumbs, Button } from "@material-ui/core";
import Timer from "../../common/timer";
import FavoriteCheckbox from "../../components/atoms/FavoriteCheckbox";
import BiddingItem from "../../components/molecules/Bidding/BiddingItem";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
// import { viewProduct } from "../Search/DummyData";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import GridView from "../../components/molecules/ProductCard/GridView";
import Slider from "react-slick";
import { useMediaQuery } from "react-responsive";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {
  handleRedirectInternal,
  searchQueryParam,
  currencyFormat,
  capitalize,
  noImageAvailable,
  getImages_url_check,
  DirectAPICAll,
} from "../../common/components";
import { useHistory, useLocation } from "react-router-dom";
import ProductContext from "../../context/product/productContext";
import AuctionContext from "../../context/auction/auctionContext";
import { socket } from "../../common/socket";
import AuthContext from "../../context/auth/authContext";
import CloseIcon from "@material-ui/icons/Close";
import AddCreditCard from "../AddCreditCard";
import UserContext from "../../context/user/userContext";
import Popup from "../../components/organisms/Popup";
import Loaders from "../../components/molecules/Loaders";
import PrimaryButton from "../../components/atoms/PrimaryButton";
import BiddingItemForward from "../../components/molecules/Bidding/BiddingItemForward";
import { messageHandlerSingleLot } from "../../common/socketHandler";
import alertContext from "../../context/alert/alertContext";
import BuyerContext from "../../context/buyer/buyerContext";
import BidStatus from "../../components/molecules/Bidding/BidStatus";
import Head from "next/head";

export function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <div className="tabBody">{children}</div>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

function ProductView({
  from,
  lotDetails,
  auctionDetails,
  handleClose,
  prodData,
}) {
  console.log(prodData, "prodData");
  const isMobile = useMediaQuery({
    query: "(max-width: 600px)",
  });
  const location = useLocation();
  const history = useHistory();
  const classes = useStyles();
  const [currentLotDetails, setCurrentLotDetails] = useState({});
  const [currentLotImages, setCurrentLotImages] = useState([]);
  const [value, setValue] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [similarPro, setSimilarProd] = useState([]);
  const [auctionDtl, setActionDtl] = useState({});
  const [viewAddCredit, setViewAddCredit] = useState(false);
  const [savedCards, setSavedCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reload, setReload] = useState(false);
  const [currentPrice, setCurrentPrice] = useState("");
  const [buynowbtnDisable, setBuynowbtnDisable] = useState(false);
  // const [productDetails, setProductDetails] = useState([]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  let auctionlotid = searchQueryParam(location.search, "auctionLotId");
  let auctionId = searchQueryParam(location.search, "auctionId");

  const {
    getAllSearchProducts,
    search_allproducts,
    individual_product_dtls,
    getIndividualProductLotId,
    getIndividualProductLotDetails,
    lot_details,
    addWatchlist,
  } = useContext(ProductContext);

  const {
    getBuynowCheckout,
    getStripeCard,
    buynow_cart_items,
    removeFromCart,
  } = useContext(UserContext);
  const { addToCartSingle } = useContext(BuyerContext);
  const {
    getAuctionDetails,
    auctiondetails,
    allauctionlots,
    getSellerInfo,
    auctionSellerDtls,
  } = useContext(AuctionContext);
  const { setAlert } = useContext(alertContext);
  const { isAuthenticated, user } = useContext(AuthContext);

  useEffect(() => {
    // console.log("current price changed", currentPrice);
    setReload(!reload);
  }, [currentPrice]);

  const getAllSavedCards = async () => {
    const result = await getStripeCard({ userid: user.id });
    if (
      result &&
      result.result_stripe &&
      result.result_stripe.status === "success"
    ) {
      setSavedCards(result.result_stripe.data.responseData.data);
    }
  };

  useEffect(() => {
    // console.log(lotDetails, "this is lot details");
    if (lotDetails && Object.keys(lotDetails).length > 0) {
      lotDetails.lotDetails.bidmsg = "";
      lotDetails.lotDetails.bid_or_not = 0;
      if (
        lotDetails &&
        lotDetails.bids_offer &&
        parseInt(lotDetails.bids_offer.length) > 0
      ) {
        lotDetails.lotDetails.bid_or_not = 1;
        if (parseInt(lotDetails.bids_offer[0].max_user) == parseInt(user.id)) {
          lotDetails.lotDetails.bidmsg = "You Are Winning";
          lotDetails.lotDetails.win = 1;
        } else {
          lotDetails.lotDetails.bidmsg = "You Are Losing";
          lotDetails.lotDetails.win = 0;
        }
      }
      setCurrentLotDetails(lotDetails);
    }
  }, [lotDetails]);
  useEffect(() => {
    // console.log(auctiondetails, "auctiondetails");
    if (auctiondetails && Object.keys(auctiondetails).length !== 0) {
      setActionDtl(auctiondetails);
    }
  }, [auctiondetails]);

  useEffect(() => {
    // console.log(user, "tyhisi is user");
    if (user && Object.keys(user).length) getAllSavedCards();
  }, [user]);

  useEffect(() => {
    if (
      location.pathname === "/auctionView" &&
      lotDetails &&
      Object.keys(lotDetails).length > 0
    ) {
      socket.on("bidoffers", (data) => {
        // console.log("bidoffers socket", data);
        if (
          data &&
          Object.keys(data).length > 0 &&
          lotDetails &&
          Object.keys(lotDetails).length > 0
        ) {
          let newLot = lotDetails;

          if (data.lotid === newLot.lotDetails.id) {
            newLot.lotDetails.bidcnt = data.bids_offer[0].bidcnt;
            newLot.lotDetails.wprice = data.bids_offer[0].current_amount;
            newLot.current_bid = data.bids_offer[0].current_amount;
            if (
              (parseInt(data.bids_offer.length) > 0 &&
                parseInt(newLot.lotDetails.bid_or_not) == 1) ||
              parseInt(data.bids_offer[0].current_users) == parseInt(user.id)
            ) {
              newLot.lotDetails.bid_or_not = 1;
              if (parseInt(data.bids_offer[0].max_user) == parseInt(user.id)) {
                newLot.lotDetails.bidmsg = "You Are Winning";
                newLot.lotDetails.win = 1;
              } else {
                newLot.lotDetails.bidmsg = "You Are Losing";
                newLot.lotDetails.win = 0;
              }
            }
          }

          setCurrentLotDetails(newLot);
        }
      });
    }
  }, []);
  useEffect(() => {
    if (Object.keys(lot_details).length > 0) {
      lot_details.lotDetails.bid_or_not = 0;
      lot_details.lotDetails.bidmsg = "";
      // if (
      //   lot_details &&
      //   lot_details.bids_offer &&
      //   parseInt(lot_details.bids_offer.length) > 0
      // ) {
      //   lot_details.lotDetails.bid_or_not = 1;
      //   if (parseInt(lot_details.bids_offer[0].max_user) == parseInt(user.id)) {
      //     lot_details.lotDetails.bidmsg = "You Are Winning";
      //     lot_details.lotDetails.win = 1;
      //   } else {
      //     lot_details.lotDetails.bidmsg = "You Are Losing";
      //     lot_details.lotDetails.win = 0;
      //   }
      // }
      setCurrentLotDetails(lot_details);
      setCurrentPrice(lot_details?.current_bid);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, [lot_details]);

  useEffect(() => {
    let lotimages = [];
    if (
      currentLotDetails &&
      currentLotDetails.images &&
      currentLotDetails.images.length > 0
    ) {
      currentLotDetails.images.map((imgObj) =>
        lotimages.push({
          original: getImages_url_check(
            imgObj.file_name,
            currentLotDetails.lotDetails.content_head1
          ),
          thumbnail: getImages_url_check(
            imgObj.file_name,
            currentLotDetails.lotDetails.content_head1
          ),
        })
      );
    }
    setCurrentLotImages(lotimages.reverse());
  }, [currentLotDetails.images]);

  const handleExpand = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const viewProductRef = useRef(currentLotDetails);
  const userRef = useRef(user);

  useEffect(() => {
    viewProductRef.current = currentLotDetails;
    userRef.current = user;
  }, [currentLotDetails, user]);

  const handler = (message, type) => {
    messageHandlerSingleLot(
      message,
      viewProductRef.current,
      userRef.current,
      setAlert,
      setCurrentLotDetails,
      type,
      currentPrice,
      setCurrentPrice
    );
  };

  const productDetails = [
    {
      title: "Description",
      description: auctionDetails
        ? auctionDetails.description
        : auctiondetails
        ? auctiondetails.description
        : "",
    },
    // {
    //   title: 'Shipping',
    //   description: auctionDetails
    //     ? auctionDetails.store_comment_two
    //     : auctiondetails
    //     ? auctiondetails.store_comment_two
    //     : '',
    // },
    {
      title: "Terms and Conditions",
      description: auctionDetails
        ? auctionDetails.store_comment_four
        : auctiondetails
        ? auctiondetails.store_comment_four
        : "",
    },
    {
      title: "Payment",
      description: auctionDetails
        ? auctionDetails.store_comment_one
        : auctiondetails
        ? auctiondetails.store_comment_one
        : "",
    },
    {
      title: "Picking Up",
      description: auctionDetails
        ? auctionDetails.store_comment_three
        : auctiondetails
        ? auctiondetails.store_comment_three
        : "",
    },
    {
      title: "Returns",
      description: auctionDetails
        ? auctionDetails.store_comment_five
        : auctiondetails
        ? auctiondetails.store_comment_five
        : "",
    },
  ];

  const prodAuctionDtls = (notLoading) => {
    if (!notLoading) {
      setIsLoading(true);
    }
    let productDtls = {
      lotId: auctionlotid,
      user_id: user && user.id ? user.id : "",
      is_auctionio: 1,
    };
    getIndividualProductLotDetails(productDtls);
    getAuctionDetails({
      title: "",
      auctionId: auctionId,
      userid: user && user.id ? user.id : "",
      page: "",
      perpage: "",
      is_auctionio: 1,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (location.pathname == "/productView") {
      prodAuctionDtls();
    }
    if (auctionId) {
      getSellerInfo({ auctionid: auctionId });
    } // if (location.pathname == "/productView") {
    //   let auctionlotid = location.search.split("=");

    //   if (auctionlotid[0] == "auctionLotId") {
    //     setSimilarProd([]);
    //   }
    // }
  }, [location]);
  // useEffect(() => {
  //   console.log(currencyFormat("10000"), "the currency format");
  // }, []);

  useEffect(() => {
    if (allauctionlots && allauctionlots.length !== 0) {
      let auctionlotid =
        location.pathname === "/auctionView" &&
        lotDetails &&
        lotDetails.lotDetails
          ? lotDetails.lotDetails.id
          : searchQueryParam(location.search, "auctionLotId");
      // console.log(allauctionlots, "allauctionlots");
      let filteredLots = allauctionlots.filter((ele) => {
        return Number(ele.id) !== Number(auctionlotid);
      });

      setSimilarProd(filteredLots);
    }
  }, [allauctionlots, lotDetails]);

  useEffect(() => {
    socket.on("realclosedupdates", (data) => {
      handler(data, "realclosedupdates");
    });
    socket.on("bidAddtime", (data) => {
      // console.log("bid add time socket response", data);
      handler(data, "bidAddtime");
    });
    return () => {
      socket.off("realclosedupdates", (data) => {
        handler(data, "realclosedupdates");
      });
      socket.off("bidAddtime", (data) => {
        handler(data, "bidAddtime");
      });
    };
  }, []);

  const handleBuyNowClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    let data = [];
    data.push({
      id: currentLotDetails.lotDetails.id,
      user_id: user.id,
      qty: currentLotDetails.lotDetails.qty,
    });
    setBuynowbtnDisable(true);
    let cartid = buynow_cart_items.find(
      (val) => val.project_id == currentLotDetails.lotDetails.id
    );
    const result = await (cartid
      ? removeFromCart({ id: cartid?.project_id, user_id: user.id })
      : addToCartSingle({ cart_data: data }));
    if (result) {
      setAlert(
        cartid ? "Item Removed From Your Cart!" : "Item Added To your Cart!",
        "success"
      );
      getBuynowCheckout({ user_id: user.id });
    } else {
      setAlert("An Error Occured", "error");
    }
    setBuynowbtnDisable(false);
  };
  return (
    <div className="productView">
      <Head>
        <meta property="og:title" content="Title test SEO" />
        <meta
          property="og:description"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip"
        />
      </Head>
      {isLoading ? (
        <div className="customContainer">
          <Loaders name="product_view" isLoading={isLoading} />
        </div>
      ) : (
        <>
          {currentLotDetails && Object.keys(currentLotDetails).length !== 0 ? (
            <>
              <div className="customContainer">
                {isAuthenticated ? (
                  currentLotDetails?.lotDetails?.auction ? (
                    <BidStatus bidTopStatus={currentLotDetails.bidtopstatus} />
                  ) : null
                ) : null}
              </div>
              {from === "slider" && (
                <>
                  <CloseIcon
                    className="product-slider-close"
                    onClick={handleClose}
                  />
                  <h4
                    onClick={() =>
                      handleRedirectInternal(
                        history,
                        "productView",
                        `?auctionId=${searchQueryParam(
                          location.search,
                          "auctionId"
                        )}&auctionLotId=${currentLotDetails?.lotDetails?.id}`
                      )
                    }
                    className="viewFull d-flex justify-content-center align-items-center"
                  >
                    <span className="material-icons">launch</span> View Full
                    Details
                  </h4>
                </>
              )}
              <div className="d-flex flex-wrap customContainer">
                <div className="pvLt">
                  {from !== "slider" && (
                    <Button
                      onClick={() => {
                        history.goBack();
                        window.scrollTo(0, 0);
                      }}
                      className="moveBack mb-2"
                    >
                      <span className="material-icons">arrow_back</span>
                      Back
                    </Button>
                  )}
                  {currentLotImages.length > 0 ? (
                    <ImageGallery
                      items={currentLotImages}
                      onImageError={(e) => noImageAvailable(e)}
                      onThumbnailError={(e) => noImageAvailable(e)}
                      thumbnailPosition={`${isMobile ? "bottom" : "left"}`}
                      showNav={false}
                      showBullets={false}
                      showFullscreenButton={true}
                      showPlayButton={false}
                    />
                  ) : (
                    ""
                  )}
                </div>
                <div className="pvRt">
                  <p className="lot-id mt-4">
                    <span>Lot ID:</span>
                    <span className="lot-no">
                      {currentLotDetails.lotDetails.sku
                        ? currentLotDetails.lotDetails.sku
                        : currentLotDetails.lotDetails.deed_document
                        ? currentLotDetails.lotDetails.deed_document
                        : currentLotDetails.lotDetails.lot_number
                        ? currentLotDetails.lotDetails.lot_number
                        : currentLotDetails.lotDetails.id}
                    </span>
                  </p>
                  <h1>
                    <div
                      className="content"
                      dangerouslySetInnerHTML={{
                        __html: capitalize(currentLotDetails.lotDetails.title),
                      }}
                    />
                  </h1>
                  {/* <div className="featuredOn">
                    <h6>Featured on:</h6>
                    <img src="/assets/images/slibuy.png" alt="Slibuy Logo" />
                  </div> */}
                  <div className="pvMiscActions">
                    <FavoriteCheckbox
                      withLabel={true}
                      project_id={currentLotDetails.lotDetails.id}
                      watchlisted={currentLotDetails.lotDetails.wat_list}
                      updateData={() => prodAuctionDtls(true)}
                    />
                    {/* <Button>View Bid History</Button> */}
                  </div>
                  {currentLotDetails.lotDetails.bidmsg ? (
                    <div>
                      <p
                        style={
                          parseInt(currentLotDetails.lotDetails.win) == 1
                            ? { color: "#70a340" }
                            : { color: "#eboa1f" }
                        }
                      >
                        {currentLotDetails.lotDetails.bidmsg}
                      </p>
                    </div>
                  ) : (
                    ""
                  )}

                  <p className="estmtChkd">
                    Location:{" "}
                    {currentLotDetails?.lotDetails?.state &&
                    currentLotDetails?.lotDetails?.country ? (
                      <span>{`${currentLotDetails?.lotDetails?.state}, ${currentLotDetails?.lotDetails?.country}`}</span>
                    ) : (
                      "Not available"
                    )}
                  </p>

                  <div className="prTmrCntn">
                    <div className="d-flex justify-content-between align-items-center w-100 mb-2 flex-wrap">
                      <p className="estmtChkd">
                        Est:{" "}
                        {currencyFormat(
                          currentLotDetails.lotDetails.lowest || 100
                        )}{" "}
                        -{" "}
                        {currencyFormat(
                          currentLotDetails.lotDetails.highest || 1000
                        )}
                      </p>

                      {currentLotDetails.lotDetails.auction &&
                      currentLotDetails.lotDetails.market_status === "open" ? (
                        <div className="timerContent">
                          <Timer
                            date_added={currentLotDetails.lotDetails.date_added}
                            date_closed={
                              currentLotDetails.lotDetails.date_closed
                            }
                            withText={1}
                            endText={"Time left:"}
                            startText={"Starts in:"}
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                  {currentLotDetails.lotDetails.auction ? (
                    <div className="pvPrimActions">
                      <div className="d-flex justify-content-between align-items-center w-100">
                        <h2>
                          {currencyFormat(currentLotDetails.current_bid)}{" "}
                          {/* <span>4 bids</span> */}
                        </h2>
                      </div>
                      {auctionDtl && auctionDtl.auction_type !== 1 ? (
                        <>
                          <div className="bdFldLablel mb-2">
                            <label>YOUR MAXIMUM BID:</label>
                            <label className="scrLbl">
                              <span className="material-icons">lock</span>SECURE
                            </label>
                          </div>
                          {currentLotDetails?.store_config?.hard_bid == 1 ? (
                            <BiddingItemForward
                              lotdetails={currentLotDetails}
                              type="hard"
                              size="medium"
                              className="fs-16"
                              auctionId={parseInt(
                                currentLotDetails?.lotDetails?.lotof
                              )}
                              auctionDtl={auctionDtl}
                              listOfCards={savedCards}
                              setViewAddCredit={setViewAddCredit}
                            />
                          ) : null}
                          {/* <BiddingItem
                          lotdetails={currentLotDetails}
                          type="hard"
                          size="medium"
                          className="fs-16"
                          auctionId={parseInt(
                            currentLotDetails?.lotDetails?.lotof
                          )}
                          auctionDtl={auctionDtl}
                          listOfCards={savedCards}
                          setViewAddCredit={setViewAddCredit}
                        /> */}
                          {currentLotDetails?.store_config?.proxy_bid == 1 &&
                          currentLotDetails?.store_config?.hard_bid == 1 ? (
                            <h6 className="pvActDivider">OR</h6>
                          ) : null}
                          {currentLotDetails?.store_config?.proxy_bid == 1 ? (
                            <BiddingItemForward
                              lotdetails={currentLotDetails}
                              type="proxy"
                              size="medium"
                              className="fs-16"
                              auctionId={parseInt(
                                currentLotDetails?.lotDetails?.lotof
                              )}
                              listOfCards={savedCards}
                              setViewAddCredit={setViewAddCredit}
                              auctionDtl={auctionDtl}
                            />
                          ) : null}
                        </>
                      ) : (
                        <PrimaryButton
                          label={"View More"}
                          btnSize={"small mt-2"}
                          onClick={(e) => {
                            e.preventDefault();
                            handleRedirectInternal(
                              history,
                              `lotview/${searchQueryParam(
                                location.search,
                                "auctionId"
                              )}/${currentLotDetails.lotDetails.id}/${
                                user && user.id ? user.id : 0
                              }`
                            );
                          }}
                        />
                      )}
                    </div>
                  ) : null}
                  <hr />
                  <div className="productTxtContainer">
                    <ul className="shpngPlcyDtl">
                      <li>
                        <span className="material-icons">monetization_on</span>
                        Buyer Premium
                        <span>
                          {currentLotDetails.lotDetails.buyer_premium} %
                        </span>
                      </li>
                    </ul>
                  </div>
                  {currentLotDetails.lotDetails.buynow &&
                  currentLotDetails.lotDetails.market_status === "open" ? (
                    <PrimaryButton
                      label={
                        isAuthenticated
                          ? buynowbtnDisable
                            ? "Loading..."
                            : `${
                                buynow_cart_items.find(
                                  (val) =>
                                    val.project_id ==
                                    currentLotDetails.lotDetails.id
                                )
                                  ? "Remove From Cart"
                                  : "Add To Cart"
                              }`
                          : "Login To Buy Now"
                      }
                      disabled={buynowbtnDisable}
                      btnSize={"small"}
                      onClick={handleBuyNowClick}
                    />
                  ) : null}
                </div>
              </div>
            </>
          ) : null}
          <div
            className={`${
              (isMobile || from === "slider") && "mobileView"
            } productDetails customContainer`}
          >
            {isMobile || from === "slider" ? (
              <div className="pvAccordian mt-2 mb-2 w-100">
                {productDetails.map((data, index) => (
                  <Accordion
                    expanded={expanded === `panel${index}`}
                    onChange={handleExpand(`panel${index}`)}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`panel${index}a-content`}
                      id={`panel${index}a-header`}
                    >
                      <Typography className={classes.heading}>
                        {data.title}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        {data.title === "Description" ? (
                          <div
                            className="content"
                            dangerouslySetInnerHTML={{
                              __html:
                                currentLotDetails?.lotDetails?.description,
                            }}
                          />
                        ) : (
                          <div
                            className="content"
                            dangerouslySetInnerHTML={{
                              __html: data.description,
                            }}
                          />
                        )}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </div>
            ) : (
              <>
                {auctiondetails && Object.keys(auctiondetails).length ? (
                  <>
                    <AppBar position="static">
                      <Tabs
                        value={value}
                        onChange={handleChange}
                        aria-label="simple tabs example"
                      >
                        {productDetails.map((data, index) => (
                          <Tab label={data.title} {...a11yProps({ index })} />
                        ))}
                      </Tabs>
                    </AppBar>
                    {productDetails.map((data, index) => (
                      <TabPanel value={value} index={index}>
                        {data.title === "Description" ? (
                          <div
                            className="content"
                            dangerouslySetInnerHTML={{
                              __html:
                                currentLotDetails?.lotDetails?.description,
                            }}
                          />
                        ) : (
                          <div
                            className="content"
                            dangerouslySetInnerHTML={{
                              __html: data.description,
                            }}
                          />
                        )}
                      </TabPanel>
                    ))}
                  </>
                ) : null}
              </>
            )}
          </div>
        </>
      )}

      <Popup
        open={viewAddCredit}
        size="sm"
        modaltitle="Add Card Details"
        handleClose={() => {
          setViewAddCredit(false);
        }}
      >
        <AddCreditCard
          getSavedCards={getAllSavedCards}
          setViewAddCredit={setViewAddCredit}
        />
      </Popup>
    </div>
  );
}

export async function getServerSideProps() {
  const res = await fetch(`${global.site_url}/api_buyer/lotDetails`);
  const prodData = await res.json();
  console.log(prodData, "viewData");
  return { props: { prodData } };
}

export default ProductView;
