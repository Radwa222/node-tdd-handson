const express = require('express');
const { signUp } = require('./user.controller');
const router = express.Router();
const { signUpValidation } = require('./user.validations');

router.post('/api/1.0/signup', ...signUpValidation, signUp);

module.exports = router;
