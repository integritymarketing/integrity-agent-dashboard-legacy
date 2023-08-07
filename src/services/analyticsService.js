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

const analyticsServiceInstance = new AnalyticsService();

export default analyticsServiceInstance;
