const express = require('express');
const { signUp } = require('./user.controller');
const router = express.Router();

router.post('/api/1.0/users', signUp);

module.exports = router;
