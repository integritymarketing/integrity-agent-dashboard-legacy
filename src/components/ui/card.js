import React from 'react';

const Card = ({className = '', ...props}) => {
  return (
    <div className={`card ${className}`} {...props}></div>
  )
};

export default Card;
