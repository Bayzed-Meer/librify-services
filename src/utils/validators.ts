import validator from 'validator';

export const isValidEmail = (email: string): boolean => {
  return validator.isEmail(email);
};

export const isStrongPassword = (
  password: string,
  options = {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  },
): boolean => {
  return validator.isStrongPassword(password, options);
};
