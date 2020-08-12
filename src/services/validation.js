class ValidationService {
  validateRequired = (field, label = "Field") => {
    if (!field) {
      return `${label} is required`;
    }

    return null;
  };

  validateNPN = (npn, label = "NPN") => {
    return this.validateRequired(npn, label);
  };

  validatePasswordAccess = (password, label = "Password") => {
    return this.validateRequired(password, label);
  };

  validatePasswordCreation = (password, label = "Password") => {
    return this.composeValidator([
      this.validateRequired,
      () => {
        if (password.length < 8) {
          return `${label} must be at least 8 characters long`;
        } else if (!/[A-Z]/.test(password)) {
          return `${label} must include at least one uppercase letter`;
        } else if (!/[a-z]/.test(password)) {
          return `${label} must include at least one lowercase letter`;
        } else if (!/[0-9]/.test(password)) {
          return `${label} must include at least one number`;
        } else {
          return null;
        }
      },
    ])(password, label);
  };

  validateFieldMatch = (matchingField) => (field, label = "Passwords") => {
    if (field !== matchingField) {
      return `${label} must match`;
    }

    return null;
  };

  validateEmail = (email, label = "Email Address") => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!re.test(String(email).toLowerCase())) {
      return `${label} must be a valid address`;
    }

    return null;
  };

  composeValidator = (validators = []) => {
    return (...validatorArgs) =>
      validators.reduce((result, validator) => {
        if (result) return result;
        return validator(...validatorArgs);
      }, null);
  };

  validateMultiple = (validations, values, errorsObj = {}) => {
    return validations.reduce((currErrs, { validator, name, args = [] }) => {
      const result = validator(values[name], ...args);
      if (result === null) {
        return currErrs;
      }
      return Object.assign({}, currErrs, {
        [name]: result,
      });
    }, errorsObj);
  };

  getPageErrors = () => {
    // TODO: get errors passed in from page load
    // return "Sorry, that login info didn't work";
    return null;
  };
}

export default new ValidationService();
