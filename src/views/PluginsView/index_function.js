import React, { useState, useEffect, useContext } from "react";
import { Button } from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom";
import ProductContext from "../../context/product/productContext";
import { currencyFormat } from "../../common/components";

const PluginsView = ({ pluginData, p_type }) => {
  const history = useHistory();

  return (
    <div className="flscrnDscrptnPopup">
      {pluginData && (
        <>
          <div className="dscrptnContainer customContainer">
            <div className="tpMnCntnr d-flex justify-content-center align-items-center">
              <Button
                className="bkButton mt-3 ml-4"
                onClick={() => history.goBack()}
              >
                <span class="material-icons-outlined mr-2">
                  keyboard_backspace
                </span>
                Back
              </Button>
              <div className="row">
                <div className="col-md-6">
                  <h2 className="pview-head">{pluginData.menu_name}</h2>
                  <p>{pluginData.description}</p>
                </div>
                <div className="col-md-6">
                  <video width="100%" height="275" controls>
                    <source src={pluginData.video_link} type="video/mp4" />
                  </video>
                </div>
              </div>
            </div>
          </div>
          <div className="pyCntnr">
            <div className="customContainer d-flex align-items-center justify-content-between">
              <div className="lftInfo">
                <div className="lgCntnr">
                  <img
                    src={process.env.NEXT_PUBLIC_IMAGE_URL + pluginData.image}
                  />
                </div>
                <div className="prcCntr">
                  <p>Price</p>
                  <h2>
                    <>
                      {currencyFormat(pluginData.price)}/{pluginData.duration}
                    </>
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PluginsView;
