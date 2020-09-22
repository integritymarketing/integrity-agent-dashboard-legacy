export default (paramString = window.location.search) => {
  const searchParams = new URLSearchParams(paramString);

  return {
    get: (param) => {
      return searchParams.get(param);
    },
  };
};
