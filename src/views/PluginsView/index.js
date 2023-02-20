import React, { useState, useEffect, useContext } from "react";
import { Button } from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom";
import ProductContext from "../../context/product/productContext";
import Loaders from "../../components/molecules/Loaders";
import PluginsViewPage from "./index_function";

const PluginsView = () => {
  const history = useHistory();
  const url = useLocation();
  // console.log("url", url, url.search);
  let searchparams = new URLSearchParams(url.search);
  let p_type = searchparams.get("type");

  const { plugin_lists, availablePluginList } = useContext(ProductContext);

  const [pluginData, setPluginData] = useState("");

  useEffect(() => {
    availablePluginList();
  }, []);

  useEffect(() => {
    let data = plugin_lists.filter((d) => d.plugin_name === p_type);
    setPluginData(data[0]);
  }, [plugin_lists]);

  return <PluginsViewPage p_type={p_type} pluginData={pluginData} />;
};

export default PluginsView;
