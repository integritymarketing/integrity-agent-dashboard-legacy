export const disableTextMessage = false;

export const getCommunicationOptions = () => {
  if (disableTextMessage) {
    return [{ value: 'email', label: 'Email' }];
  } else {
    return [
      { value: 'email', label: 'Email' },
      { value: 'mobile', label: 'Text' },
    ];
  }
};
