import dateFnsParse from "date-fns/parse";
import isDate from "date-fns/isDate";

function getProp(object, keys, defaultVal) {
  keys = Array.isArray(keys) ? keys : keys.split(".");
  object = object[keys[0]];
  if (object && keys.length > 1) {
    return getProp(object, keys.slice(1), defaultVal);
  }
  return object === undefined ? defaultVal : object;
}

function setProp(object, keys, val) {
  keys = Array.isArray(keys) ? keys : keys.split(".");
  if (keys.length > 1) {
    object[keys[0]] = object[keys[0]] || {};
    return setProp(object[keys[0]], keys.slice(1), val);
  }
  object[keys[0]] = val;
}

class ValidationService {
  validateRequired = (field, label = "Field") => {
    if (!field) {
      return `${label} is required`;
    }

    return null;
  };

  validateRequiredIf = (isRequired) => (field, label = "Field") => {
    if (!field && isRequired) {
      return `${label} is required`;
    }

    return null;
  };

  validateName = (username, label = "firstName") => {
    if (username && !/^[0-9A-Za-z!@.,;:'"?-]{2,}$/.test(username)) {
      return `${label} must be 2 characters or more accept only alpha numerics, no special characters such as ! @ . , ; : ' " ? -`;
    }

    if (username && !/^[0-9A-Za-z!@.,;:'"?-]{2,50}$/.test(username)) {
      return `${label} must be 50 characters or less`;
    }

    // else
    return this.validateRequired(username, label);
  };

  validateUsername = (username, label = "NPN") => {
    if (username && !/^[0-9A-Za-z!@.,;:'"?-]{2,}$/.test(username)) {
      return `${label} must be 2 characters or more`;
    }

    if (username && !/^[0-9A-Za-z!@.,;:'"?-]{2,50}$/.test(username)) {
      return `${label} must be 50 characters or less`;
    }

    // else
    return this.validateRequired(username, label);
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
        } else if (!/[^a-zA-Z\d\s:]/.test(password)) {
          return `${label} must include at least one non-alphanumeric character`;
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

    if (email && !re.test(String(email).toLowerCase())) {
      return `${label} must be a valid address`;
    }

    return null;
  };

  validatePhone = (phoneNumber, label = "Phone Number") => {
    const cleaned = ("" + phoneNumber).replace(/\D/g, "");

    if (phoneNumber && cleaned.length !== 10) {
      return `${label} must be a valid 10-digit phone number`;
    }

    return null;
  };

  validateDate = (dateStr, label = "Date") => {
    const parsed = dateFnsParse(dateStr, "MM/dd/yyyy", new Date());
    if (dateStr && (dateStr.length < 10 || !isDate(parsed))) {
      return `${label} must use the format MM/DD/YYYY`;
    }
    return null;
  };

  validatePostalCode = (inputStr, label = "Zip Code") => {
    if (inputStr && !/^[0-9]{5}$/.test(inputStr)) {
      return `${label} must be 5 digits long`;
    }
    return null;
  };

  validateState = (inputStr, label = "State Code") => {
    if (inputStr && !/^[A-Za-z]{2}$/.test(inputStr)) {
      return `${label} must be 2 characters only`;
    }
    return null;
  };

  validateCity = (inputStr, label = "City") => {
    if (inputStr && !/^[a-zA-Z ]{4,}$/.test(inputStr)) {
      return `${label} must be a valid characters only`;
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
      const result = validator(getProp(values, name), ...args);
      if (result === null) {
        return currErrs;
      }
      const errors = Object.assign({}, currErrs);
      setProp(errors, name, result);
      return errors;
    }, errorsObj);
  };

  // set first character to lower case
  // from .NET API returning CamelCase attrs
  standardizeValidationKeys = (errorsArr) => {
    errorsArr.forEach((el) => {
      if (el.hasOwnProperty("Key")) {
        el["Key"] = el["Key"].charAt(0).toLowerCase() + el["Key"].slice(1);
      }
    });
    return errorsArr;
  };

  formikErrorsFor = (errorsArr) => {
    let formikErrors = {};
    errorsArr.forEach((el) => {
      if (el.hasOwnProperty("Key")) {
        formikErrors[el["Key"]] = el["Value"];
      }
    });
    return formikErrors;
  };
}

export default new ValidationService();
