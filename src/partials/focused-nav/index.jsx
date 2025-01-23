import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'components/ui/Button';
import ArrowDown from 'components/icons/arrow-down';
import './index.scss';
import Container from 'components/ui/container';

const FocusedNav = ({ backText, onBackClick }) => {
  return (
    <div className="focused-nav">
      <Container>
        <div className="back-button">
          <Button
            icon={<ArrowDown />}
            label={backText}
            onClick={onBackClick}
            type="tertiary"
          />
        </div>
      </Container>
    </div>
  );
};

FocusedNav.propTypes = {
  backText: PropTypes.string.isRequired,
  onBackClick: PropTypes.func.isRequired,
};

export default FocusedNav;
