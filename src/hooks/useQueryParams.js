const useQueryParams = (paramString = window.location.search) => {
  const searchParams = new URLSearchParams(paramString);

  return {
    get: (param) => {
      return searchParams.get(param);
    },
  };
};

export default useQueryParams;
