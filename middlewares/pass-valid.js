const joi = require('joi');
const {BadRequestError} = require('../errors');

// Define a schema for password validation
const passwordSchema = joi.string()
.min(8)
.regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/) // Customize your password requirements
.required()
.error(new BadRequestError('Invalid Password'))

const validatePassword = (password) => {
    const {error} = passwordSchema.validate(password);
    return error ? error.details[0].message : null;
}

module.exports = validatePassword