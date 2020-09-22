import React from "react";

const Card = React.forwardRef(({ className = "", ...props }, ref) => (
  <div className={`card ${className}`} ref={ref} {...props}></div>
));

export default Card;
