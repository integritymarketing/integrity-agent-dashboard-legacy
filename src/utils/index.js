import authService from "services/authService";

export const getUserInfo = async () => {
  const { profile } = await authService.getUser();
  return profile ?? {};
};

export const formatPhoneNumber = (number) => {
  if (!number) {
    return number;
  }
  const arr = number.split("");
  arr.splice(3, 0, "-");
  arr.splice(7, 0, "-");
  return arr.join("");
};
