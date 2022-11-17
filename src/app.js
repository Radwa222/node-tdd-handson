const express = require('express');
const { userRoutes } = require('./user-module/.');
const app = express();
app.use(express.json());
app.use(userRoutes);

module.exports = app;
