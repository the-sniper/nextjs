import React from "react";
import { useLocation } from "react-router-dom";

const TemplatePreview = () => {
  const location = useLocation();
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: location?.state }}></div>
    </div>
  );
};

export default TemplatePreview;
