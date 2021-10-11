export const greetings = () => {
  var myDate = new Date();
  var hours = myDate.getHours();
  var greet;

  if (hours < 12) greet = "Morning";
  else if (hours >= 12 && hours <= 17) greet = "Afternoon";
  else if (hours >= 17 && hours <= 24) greet = "Evening";
  return greet;
};
