import React, { useState } from "react";
import "./backToTop.scss";

export const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  const returnFunction = () => {
    window.scrollTo(0, 0);
  };

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) {
      setVisible(true);
    } else if (scrolled <= 300) {
      setVisible(false);
    }
  };

  window.addEventListener("scroll", toggleVisible);
  return (
    <div className={`backToTop ${visible ? "visible" : "hidden"}`}>
      <div className='backToTop-text'>back to top</div>
    <button
      type="button"
      className={`backToTop-button`}
      onClick={returnFunction}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#0052CE"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
        class="feather feather-arrow-up"
      >
        <line x1="12" y1="19" x2="12" y2="5"></line>
        <polyline points="5 12 12 5 19 12"></polyline>
      </svg>
    </button>
    </div>
  );
};
