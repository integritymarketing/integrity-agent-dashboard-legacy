export const getPlaneRollURL = () => {
  const location = window.location.host;
  if (location.includes('qa')) {
    return 'https://qa.planenroll.com';
  }
  if (location.includes('stage')) {
    return 'https://stage.planenroll.com';
  }
  return 'https://planenroll.com';
};
