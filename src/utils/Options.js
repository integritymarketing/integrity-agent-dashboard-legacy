import React from 'react'

function Options ({ header, subHeader, subSubHeader }) {
    return (
    <div className="option">
      <div className="header">{header}</div>
      { subHeader && <div className="subHeader">{subHeader}</div> }
      { subSubHeader && <div className="subSubHeader">{subSubHeader}</div> }
    </div>
    )
}

export default Options

