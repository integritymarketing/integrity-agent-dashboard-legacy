import React from "react";
import Card from "components/ui/card";

export default ({ className = "", ...props }) => {
  return <Card className={`card--page ${className}`} {...props}></Card>;
};
