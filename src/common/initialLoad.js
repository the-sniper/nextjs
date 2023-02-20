import { useContext, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import CommonContext from "@/context/common/commonContext";
import csc from "country-state-city";

const InitialLoad = () => {
  const commonContext = useContext(CommonContext);

  const { loaderSet, getAllCountries, getAllStates } = commonContext;

  const loaded = useRef(false);

  // Loading Google Place API Script
  function loadScript(src, position, id) {
    if (!position) {
      return;
    }

    const script = document.createElement("script");
    script.setAttribute("async", "");
    script.setAttribute("id", id);
    script.src = src;
    position.appendChild(script);
  }

  if (typeof window !== "undefined" && !loaded.current) {
    if (!document.querySelector("#google-maps")) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`,
        document.querySelector("head"),
        "google-maps"
      );
    }

    loaded.current = true;
  }

  useEffect(() => {
    const USStates = [];
    const allCountries = csc.getAllCountries().map((ele) => {
      return { value: ele.id, show: ele.name };
    });
    csc.getStatesOfCountry("231").map((lot) => {
      USStates.push({ value: lot.name, show: lot.name });
    });
  }, []);

  global.ignoreCountry = [];
  global.defaultCountry = "US";
  global.ignoreStates = [];

  const history = useRouter();

  // const { enqueueSnackbar } = useSnackbar()
  // const classes = useStyles();
  // warning error info success
  return <> </>;
};

export default InitialLoad;
