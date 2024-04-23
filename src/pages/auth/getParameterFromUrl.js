export const getParameterFromUrl = (url, paramName) => {
    if (!url) {
        return null;
    }
    const urlParams = new URLSearchParams(new URL(url).search);
    return urlParams.get(paramName);
};
