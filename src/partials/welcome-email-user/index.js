import React from "react";
import "./index.scss";

function WelcomeEmailUser({ firstName, lastName, className = "" }) {
  return (
    <div className={`${className} welcome-content mb-2`}>
      <div className="client-name">
        Welcome {firstName} {lastName}
      </div>
      <div className="client-content mt-2">
        Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras
        mattis consectetur purus sit amet fermentum.
      </div>
    </div>
  );
}

export default WelcomeEmailUser;
