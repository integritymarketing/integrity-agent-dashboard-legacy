const defaultRequiredError = (label) => `${label} in required`;

class ValidationService {
  validateNPN = (npn, label = "NPN") => {
    if (!npn) {
      return defaultRequiredError(label);
    }

    return null;
  };

  validatePasswordAccess = (password, label = "Password") => {
    if (!password) {
      return defaultRequiredError(label);
    }

    return null;
  };

  validatePasswordCreation = (password, label = "Password") => {
    if (!password) {
      return defaultRequiredError(label);
    } else if (password.length < 8) {
      return `${label} must be at least 8 characters long`;
    } else if (!/[A-Z]/.test(password)) {
      return `${label} must include at least one uppercase letter`;
    } else if (!/[a-z]/.test(password)) {
      return `${label} must include at least one lowercase letter`;
    } else if (!/[0-9]/.test(password)) {
      return `${label} must include at least one number`;
    }

    return null;
  };

  getPageErrors = () => {
    // TODO: get errors passed in from page load
    // return "Sorry, that login info didn't work";
    return null;
  };
}

export default new ValidationService();
