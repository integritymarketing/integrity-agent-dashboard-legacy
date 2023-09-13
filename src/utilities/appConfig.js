export const disableTextMessage = true;

export const getCommunicationOptions = () => {
  if (disableTextMessage) {
    return [{ value: "email", label: "Email" }];
  } else {
    return [
      { value: "email", label: "Email" },
      { value: "mobile", label: "Mobile" },
    ];
  }
};
