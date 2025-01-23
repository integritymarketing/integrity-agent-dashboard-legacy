import React from 'react';
import PropTypes from 'prop-types';
import Spinner from './Spinner';

/**
 * A higher-order component that displays a loading spinner or children based on the loading state.
 * 
 * @param {object} props - The component props.
 * @param {boolean} props.isLoading - Indicates if the loading spinner should be displayed.
 * @param {React.ReactNode} props.children - The children components to be rendered when not loading.
 * @returns {React.ReactNode} - The Spinner component or children components.
 */

const WithLoader = ({ isLoading, children }) => {
  return isLoading ? <Spinner /> : children;
};

// PropTypes for WithLoader
WithLoader.propTypes = {
  isLoading: PropTypes.bool.isRequired, // Indicates whether the content is loading
  children: PropTypes.node // The content to be displayed when not loading
};

export default WithLoader;
