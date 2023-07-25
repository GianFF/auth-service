const config = require('./config');

const isTesting = () => config.NODE_ENV === 'test';
const isDevelopment = () => config.NODE_ENV === 'development';

module.exports = {
  isTesting,
  isDevelopment,
};
