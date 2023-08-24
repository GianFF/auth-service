const express = require('express');
const { registerAuthRoutes } = require('./authentication');

// TODO:
// * protect against CSRF attacks
// * use https
const initV1 = (application) => {
  const router = express.Router();
  registerAuthRoutes(router, application);
  return router;
};

module.exports = { initV1 };
