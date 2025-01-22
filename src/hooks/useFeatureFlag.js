import { useState, useEffect } from "react";
import PropTypes from "prop-types";

/**
 * A custom hook to check the value of an environment variable representing a feature flag.
 *
 * @param {string} envVariable - The name of the environment variable to check.
 * @returns {boolean} - The value of the environment variable, indicating whether the feature is enabled or disabled.
 */

const useFeatureFlag = (envVariable) => {
  const [isFeatureEnabled, setFeatureEnabled] = useState(false);

  useEffect(() => {
    const flagValue = import.meta.env[envVariable] === "true";
    setFeatureEnabled(flagValue);
  }, [envVariable]);

  return isFeatureEnabled;
};

useFeatureFlag.propTypes = {
  envVariable: PropTypes.string.isRequired,
};

export default useFeatureFlag;
