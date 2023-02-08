import validationService from "services/validationService";

export const formValidator = async (values) => {
  const commonValidators = [
    {
      name: "firstName",
      validator: validationService.validateName,
      args: ["First Name"],
    },
    {
      name: "lastName",
      validator: validationService.validateName,
      args: ["Last Name"],
    },
    {
      name: "phone",
      validator: validationService.validatePhone,
    },
    {
      name: "acceptedSOA",
      validator: validationService.validateRequired,
      args: ["Accept SOA"],
    },
    {
      name: "address.address1",
      validator: validationService.composeValidator([
        validationService.validateAddress,
        validationService.validateRequired,
      ]),
      args: ["Address"],
    },
    {
      name: "address.address2",
      validator: validationService.composeValidator([
        validationService.validateAddress,
      ]),
      args: ["Apt, Suite, Unit"],
    },
    {
      name: "address.city",
      validator: validationService.composeValidator([
        validationService.validateAddress,
        validationService.validateRequired,
      ]),
      args: ["City"],
    },
    {
      name: "address.stateCode",
      validator: validationService.composeValidator([
        validationService.validateState,
        validationService.validateRequired,
      ]),
      args: ["State"],
    },
    {
      name: "address.postalCode",
      validator: validationService.composeValidator([
        validationService.validatePostalCode,
        validationService.validateRequired,
      ]),
      args: ["Postal Code"],
    },
  ];
  const representativeValidotor = values.hasAuthorizedRepresentative
    ? [
        {
          name: "authorizedRepresentative.firstName",
          validator: validationService.composeValidator([
            validationService.validateRequiredIf(
              values.hasAuthorizedRepresentative
            ),
            validationService.validateName,
          ]),
          args: ["First Name"],
        },
        {
          name: "authorizedRepresentative.lastName",
          validator: validationService.composeValidator([
            validationService.validateRequiredIf(
              values.hasAuthorizedRepresentative
            ),
            validationService.validateName,
          ]),
          args: ["Last Name"],
        },
        {
          name: "authorizedRepresentative.phone",
          validator: validationService.composeValidator([
            validationService.validatePhone,
          ]),
        },
        {
          name: "authorizedRepresentative.address.postalCode",
          validator: validationService.composeValidator([
            validationService.validateRequiredIf(
              values.hasAuthorizedRepresentative
            ),
            validationService.validatePostalCode,
            validationService.validateRequired,
          ]),
          args: ["Postal Code"],
        },
        {
          name: "authorizedRepresentative.address.address1",
          validator: validationService.composeValidator([
            validationService.validateRequiredIf(
              values.hasAuthorizedRepresentative
            ),
            validationService.validateAddress,
            validationService.validateRequired,
          ]),
          args: ["Address"],
        },
        {
          name: "authorizedRepresentative.address.address2",
          validator: validationService.composeValidator([
            validationService.validateAddress,
          ]),
        },
        {
          name: "authorizedRepresentative.address.city",
          validator: validationService.composeValidator([
            validationService.validateRequiredIf(
              values.hasAuthorizedRepresentative
            ),
            validationService.validateAddress,
            validationService.validateRequired,
          ]),
          args: ["City"],
        },
        {
          name: "authorizedRepresentative.address.stateCode",
          validator: validationService.composeValidator([
            validationService.validateState,
            validationService.validateRequired,
          ]),
          args: ["State"],
        },
        {
          name: "authorizedRepresentative.relationshipToBeneficiary",
          validator: validationService.composeValidator([
            validationService.validateRequiredIf(
              values.hasAuthorizedRepresentative
            ),
            validationService.validateBeneficiary,
          ]),
          args: ["Relationship to beneficiary"],
        },
      ]
    : [];
  const errors = validationService.validateMultiple(
    [...commonValidators, ...representativeValidotor],
    values
  );
  return errors;
};
