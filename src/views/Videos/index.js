import React, { useEffect, useState } from "react";
// import {
//   Swiper,
//   SwiperSlide,
//   useSwiper,
//   useSwiperSlide,
// } from "swiper/react/swiper-react";

import { EffectCoverflow, Pagination, Navigation } from "swiper";
import { Fade, IconButton } from "@material-ui/core";
import { handleRedirectInternal } from "../../common/components";
import { useHistory } from "react-router-dom";

const Videos = () => {
  // const swiperValue = useSwiperSlide();
  const history = useHistory();
  const [currentIndex, setCurrentIndex] = useState(0);
  // useEffect(() => {
  //   console.log("currentIndex", currentIndex);
  // }, [currentIndex]);
  return (
    <div className="vdosWrapper py-5">
      <h3 className="text-center mb-5">Demo Videos</h3>
      {/* <Swiper
        navigation={true}
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={3}
        onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
        coverflowEffect={{
          rotate: 20,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        breakpoints={{
          "@0.00": {
            slidesPerView: 1,
          },
          "@0.75": {
            slidesPerView: 2,
          },
          "@1.00": {
            slidesPerView: 2,
          },
          "@1.50": {
            slidesPerView: 3,
          },
        }}
        pagination={false}
        modules={[EffectCoverflow, Pagination, Navigation]}
        className="mySwiper"
      >
        <SwiperSlide>
          <div className="dmoCrdCntnr">
            <img src="/assets/images/tamizh_banner.png" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="dmoCrdCntnr">
            <img src="/assets/images/singer_banner.png" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="dmoCrdCntnr">
            <img src="/assets/images/pandian_banner.png" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="dmoCrdCntnr">
            <img src="/assets/images/roja_banner.png" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="dmoCrdCntnr">
            <img src="/assets/images/cook_banner.png" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="dmoCrdCntnr">
            <img src="/assets/images/bigboss_banner.png" />
          </div>
        </SwiperSlide>
      </Swiper> */}
      <div className="titleWrapper">
        {currentIndex === 0 ? (
          <Fade in={currentIndex === 0}>
            <IconButton
              className="plyBtn"
              onClick={() =>
                handleRedirectInternal(
                  history,
                  "videosview/tamizhum_saraswathiyum"
                )
              }
            >
              <span className="material-icons">play_arrow</span>
            </IconButton>
          </Fade>
        ) : currentIndex === 1 ? (
          <Fade in={currentIndex === 1}>
            <IconButton
              className="plyBtn"
              onClick={() =>
                handleRedirectInternal(history, "videosview/super_singer")
              }
            >
              <span className="material-icons">play_arrow</span>
            </IconButton>
          </Fade>
        ) : currentIndex === 2 ? (
          <Fade in={currentIndex === 2}>
            <IconButton
              className="plyBtn"
              onClick={() =>
                handleRedirectInternal(history, "videosview/pandian_stores")
              }
            >
              <span className="material-icons">play_arrow</span>
            </IconButton>
          </Fade>
        ) : currentIndex === 3 ? (
          <Fade in={currentIndex === 3}>
            <IconButton
              className="plyBtn"
              onClick={() =>
                handleRedirectInternal(history, "videosview/eeramana_rojave")
              }
            >
              <span className="material-icons">play_arrow</span>
            </IconButton>
          </Fade>
        ) : currentIndex === 4 ? (
          <Fade in={currentIndex === 4}>
            <IconButton
              className="plyBtn"
              onClick={() =>
                handleRedirectInternal(history, "videosview/cooku_with_comali")
              }
            >
              <span className="material-icons">play_arrow</span>
            </IconButton>
          </Fade>
        ) : currentIndex === 5 ? (
          <Fade
            in={currentIndex === 5}
            timeout={{
              enter: 5000,
              exit: 0,
            }}
          >
            <IconButton
              className="plyBtn"
              onClick={() =>
                handleRedirectInternal(history, "videosview/big_boss")
              }
            >
              <span className="material-icons">play_arrow</span>
            </IconButton>
          </Fade>
        ) : (
          ""
        )}
        <p>
          {currentIndex === 0
            ? "Tamizhum Saraswathiyum"
            : currentIndex === 1
            ? "Super Singer"
            : currentIndex === 2
            ? "Pandiyan Stores"
            : currentIndex === 3
            ? "Eeramana Rojave"
            : currentIndex === 4
            ? "Cooku With Comali"
            : currentIndex === 5
            ? "Big Boss"
            : ""}
        </p>
      </div>
    </div>
  );
};

export default Videos;
