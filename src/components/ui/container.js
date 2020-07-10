import React from 'react';

const Container = ({className = '', ...props}) => {
  return (
    <div className={`container ${className}`} {...props}></div>
  )
};

export default Container;
