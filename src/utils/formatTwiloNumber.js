export const formatTwiloNumber = (phone) => {
  let trimAreaCode = phone?.replace(/^\+1/, "");
  const cleaned = ("" + trimAreaCode).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return null;
};
