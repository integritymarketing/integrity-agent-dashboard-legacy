class AnalyticsService {
  clickClass = (id) => {
    return `gtm-${id}`;
  };

  fireEvent = (event, details = {}) => {
    if (window.dataLayer) {
      // window.dataLayer.push({
      console.log({
        event,
        ...details,
      });
    }
  };
}

export default new AnalyticsService();
