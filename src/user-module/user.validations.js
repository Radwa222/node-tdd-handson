const { check, validationResult } = require('express-validator');
const User = require('./user.model');

module.exports.signUpValidation = [
  check('username')
    .trim()
    .notEmpty()
    .withMessage('username must be not null or empty')
    .bail()
    .isLength({ max: 40, min: 4 })
    .withMessage('username must be between 4 and 40 characters'),

  check('email')
    .trim()
    .notEmpty()
    .withMessage('email address must be not null or empty')
    .bail()
    .isEmail()
    .withMessage('email address is not valid')
    .bail()
    .custom(async (value) => {
      const user = await User.findOne({ where: { email: value } });
      return user ? Promise.reject('email address is already exists!') : user;
    })
    .trim(),
  check(
    'password',
    'Password should has at least one uppercase , one lower case, one special char, one digit and  must be min 8 '
  ).isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  }),
  check('password_confirmation').custom((value, { req }) => {
    if (value === req.body.password) return true;
    throw new Error('Passwords must be match');
  }),
  check('phone_number')
    .trim()
    .isMobilePhone(['ar-EG'])
    .withMessage('phone number is not valid'),
  check('gender')
    .trim()
    .custom((value) => {
      const genderOpt = ['male', 'female'];
      if (genderOpt.includes(value)) return true;
      throw new Error(`gender must be one of [${genderOpt}]`);
    }),
];

module.exports.validateRequest = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const validationErrors = {};
    errors.array().forEach((err) => {
      validationErrors[err.param] = err.msg;
    });
    return validationErrors;
  }
};
