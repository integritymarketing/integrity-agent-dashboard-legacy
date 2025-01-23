import React from "react";
import PropTypes from "prop-types";
import { STEPS } from "./constants";
import ProviderInsights from "./ProviderInsights";
import ReviewProviders from "./ReviewProviders";

const StepComponent = ({ activeStep, setActiveStep, ...parentProps }) => {
  const renderStep = () => {
    switch (activeStep) {
      case STEPS.PROVIDER_INSIGHTS:
        return (
          <ProviderInsights {...parentProps} setActiveStep={setActiveStep} />
        );
      case STEPS.REVIEW_PROVIDERS:
        return (
          <ReviewProviders {...parentProps} setActiveStep={setActiveStep} />
        );
      default:
        return (
          <ProviderInsights {...parentProps} setActiveStep={setActiveStep} />
        );
    }
  };

  return renderStep();
};

StepComponent.propTypes = {
  activeStep: PropTypes.string.isRequired,
  setActiveStep: PropTypes.func.isRequired,
};

export default StepComponent;
