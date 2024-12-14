export const validatePhoneNumber = (phoneNumber, callingCode) => {
  // Defining validation patterns for different countries
  const patterns = {
    "+254": /^(07|01)\d{8}$/, // Kenya: 0719 537813
    "+233": /^\d{3}\d{7}$/, // Ghana: 051 7537813
  };

  const pattern = patterns[callingCode];
  if (!pattern) return false;
  return pattern.test(phoneNumber);
};
