import React from 'react';
import Logo from 'components/icons/medicare-center';
import './index.scss';

const BlueNavWithIcon = () => {
  return (
    <div className="blue-nav-header">
      <div className="medicare-icon">
        <Logo />
      </div>
    </div>
  );
};

export default BlueNavWithIcon;
