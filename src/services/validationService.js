import dateFnsParse from "date-fns/parse";
import isDate from "date-fns/isDate";

class ValidationService {
  validateRequired = (field, label = "Field") => {
    if (!field) {
      return `${label} is required`;
    }

    return null;
  };

  validateUsername = (username, label = "NPN") => {
    if (username && !/^[0-9A-Za-z!@.,;:'"?-]{2,}$/.test(username)) {
      return `${label} must be 2 characters or more`;
    }

    if (username && !/^[0-9A-Za-z!@.,;:'"?-]{2,50}$/.test(username)) {
      return `${label} must be 50 characters or less`;
    }

    return null;
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
