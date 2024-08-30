const useQueryParams = (paramString = window.location.search) => {
    const searchParams = new URLSearchParams(paramString);

    function setQueryStringParameter(name, value) {
        searchParams.set(name, value);
        window.history.replaceState(
            {},
            "",
            decodeURIComponent(`${window.location.pathname}?${searchParams.toString()}`)
        );
    }

    return {
        get: (param) => {
            return searchParams.get(param);
        },
        set: (param, value) => {
            setQueryStringParameter(param, value);
        },
    };
};

export default useQueryParams;
