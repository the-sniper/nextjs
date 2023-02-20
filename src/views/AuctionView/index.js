import React, { useState, useEffect, useContext } from "react";
import EventView from "./eventView";
import RegularView from "./regularView";
import AuctionContext from "../../context/auction/auctionContext";
import AuthContext from "../../context/auth/authContext";
import { useLocation } from "react-router-dom";

function AuctionView(props) {
  const [auctionDetails, setAuctionDetails] = useState({});
  const search = useLocation().search;

  const { getAuctionDetails, auctiondetails } = useContext(AuctionContext);
  const {
    isAuthenticated,
    user,
    donar_registration,
    getdonarexistingcard,
    getdonarlist,
    responseStatus: donar_response,
    clearResponse: donar_clearresponse,
  } = useContext(AuthContext);
  useEffect(() => {
    let auctionId = new URLSearchParams(search).get("auctionId");
    getAuctionDetails({
      title: "",
      auctionId: auctionId,
      userid: user && user.id ? user.id : "",
      page: 1,
      perpage: 25,
      orderby: 1,
      is_auctionio: 1,
    });
  }, []);
  useEffect(() => {
    if (Object.keys(auctiondetails).length > 0) {
      setAuctionDetails(auctiondetails);
    }
  }, [auctiondetails]);

  return (
    <div className="">
      {Boolean(parseInt(auctionDetails.charity_type)) ? (
        <EventView auctionDetailsInitial={auctionDetails} />
      ) : (
        <RegularView />
      )}
    </div>
  );
}

export default AuctionView;
