import React from "react";
import "./index.scss";

function WelcomeEmailUser({ firstName, lastName, className = "" }) {
  return (
    <div className={`${className} welcome-content mb-2`}>
      <div className="client-name">
        Welcome {firstName} {lastName}
      </div>
      <div className="client-content mt-2">
        Please review the plan information below at your earliest convenience
        and contact me with any questions.
      </div>
    </div>
  );
}

export default WelcomeEmailUser;
