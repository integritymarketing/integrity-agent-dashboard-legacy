import dateFnsParse from "date-fns/parse";
import { isAfter, isDate, isMatch } from "date-fns";
import { getTextFieldSchema } from "../ValidationSchemas/genericTextFieldSchema";

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
    return val;
}

class ValidationService {
    validateRequired = (field, label = "Field") => {
        if (!field) {
            return `${label} is required`;
        }

        return null;
    };

    validateRequiredIf =
        (isRequired) =>
        (field, label = "Field") => {
            if (!field && isRequired) {
                return `${label} is required`;
            }

            return null;
        };

    validateBeneficiary = (username, label = "Relationship to Beneficiary") => {
        if (username && username.length > 40) {
            return `${label} must be 40 characters or less`;
        }

        return null;
    };

    validateName = (username, label = "firstName") => {
        try {
            getTextFieldSchema(label, label).validateSync({ [label]: username }, { abortEarly: false });
            return null;
        } catch (error) {
            return error.errors[0];
        }
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

    validateFieldMatch =
        (matchingField) =>
        (field, label = "Passwords") => {
            if (field !== matchingField) {
                return `${label} must match`;
            }

            return null;
        };

    validateEmail = (email, label = "Email Address") => {
        const re =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (email && !re.test(String(email).toLowerCase())) {
            return `${label} must be a valid address`;
        }

        return null;
    };

    validateCaliforniaLicenseNumber = (licenseNumber, label = "California License Number (CLN)") => {
        const alphanumericRegex = /^[a-z0-9]+$/i;

        if (!licenseNumber) {
            return null;
        }

        if (licenseNumber.length < 7 || licenseNumber.length > 13) {
            return `${label} must be between 7 and 13 characters long.`;
        }

        if (!alphanumericRegex.test(licenseNumber)) {
            return `${label} must contain only alphanumeric characters.`;
        }

        return null;
    };

    validateMedicalBeneficiaryId = (mbiId) => {
        if (!mbiId) {
            return null;
        }
        const formattedId = String(mbiId).toUpperCase().replace(/-/g, ""); // Convert to string and remove existing hyphens
        const validPattern =
            /^[1-9][AC-HJ-KM-NP-RT-Y][AC-HJ-KM-NP-RT-Y0-9][0-9][AC-HJ-KM-NP-RT-Y][AC-HJ-KM-NP-RT-Y0-9][0-9][AC-HJ-KM-NP-RT-Y][AC-HJ-KM-NP-RT-Y][0-9][0-9]$/;
        const isValid = validPattern.test(formattedId);
        return isValid || mbiId === "" ? null : "Invalid Medicare Number";
    };

    validatePhone = (phoneNumber, label = "Phone Number") => {
        const cleaned = `${phoneNumber}`.replace(/\D/g, "");

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

    validateDateInput = (dateStr, label = "Date", format = "MM/dd/yyyy") => {
        if (dateStr && !isMatch(dateStr, format)) {
            return `${label} must use the format MM/DD/YYYY`;
        } else if (dateStr && isAfter(new Date(dateStr), new Date())) {
            return `${label} must be valid`;
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

    validateAddress = (inputStr, label = "Address") => {
        if (inputStr && !/^[0-9a-zA-Z #'.,-]{2,}$/.test(inputStr)) {
            return `${label} must be 2 characters or more, Only Alpha, Numerical, and certain special characters such as # ' . - are allowed`;
        }
        return null;
    };

    composeValidator = (validators = []) => {
        return (...validatorArgs) =>
            validators.reduce((result, validator) => {
                if (result) {
                    return result;
                }
                return validator(...validatorArgs);
            }, null);
    };

    validateMultiple = (validations, values, errorsObj = {}) => {
        return validations.reduce((currErrs, { validator, name, args = [] }) => {
            const result = validator(getProp(values, name), ...args);
            if (result === null) {
                return currErrs;
            }
            const errors = { ...currErrs };
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
        const formikErrors = {};
        errorsArr.forEach((el) => {
            if (el.hasOwnProperty("Key")) {
                formikErrors[el["Key"]] = el["Value"];
            } else if (el.hasOwnProperty("key")) {
                formikErrors[el["key"]] = el["value"];
            }
        });
        return formikErrors;
    };
}

const validationServiceInstance = new ValidationService();

export default validationServiceInstance;
