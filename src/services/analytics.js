class AnalyticsService {
  clickClass = (id) => {
    return `gtm-${id}`;
  };

  fireEvent = (event, details = {}) => {
    if (window.dataLayer) {
      window.dataLayer.push({
        event,
        ...details,
      });
    }
  };
}

export default new AnalyticsService();
