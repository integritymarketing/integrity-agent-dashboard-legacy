export default () => {
  const searchParams = new URLSearchParams(window.location.search);

  return {
    get: (param) => {
      return searchParams.get(param) || undefined;
    },
  };
};
