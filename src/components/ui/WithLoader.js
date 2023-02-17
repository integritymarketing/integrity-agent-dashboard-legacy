import React from "react";
import Spinner from "./Spinner";

const WithLoader = ({ isLoading, children }) =>
  isLoading ? <Spinner /> : children;

export default WithLoader;
