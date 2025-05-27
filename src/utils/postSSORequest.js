/**
 * Submits the SSO enabled url as a POST request.
 *
 * @param {string} url - The sso enabled url with token.
 * @param {function} errorHandler - The function to be called in case of error.
 */
export const postSSORequest = async (url, errorHandler) => {
  if (!url) {
    console.error('URL is required for SSO request submission.');
    return;
  }
  try {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = url;
    form.target = '_blank';

    document.body.appendChild(form);
    form.submit();
    // document.body.removeChild(form);
  } catch (error) {
    errorHandler(error);
  }
}
