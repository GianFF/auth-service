const config = require('./config');
const { connectDB } = require('./database/connection');
const { accountRepository } = require('./repositories/account');
// TODO: remove comment once AWS credentials granted
// const { emailService } = require('./services/email');
const { fakeEmailService } = require('./services/email');
const authService = require('./services/authentication');
const loggerFactory = require('./logger');
const { isTesting, isDevelopment } = require('./environment');

const testApp = () => ({
  loggerFactory,
  accountRepository,
  authService,
  emailService: fakeEmailService,
});

const devApp = () => {
  connectDB(config.DB_URL);

  return {
    loggerFactory,
    accountRepository,
    authService,
    emailService: fakeEmailService,
  };
};

const prodApp = () => {
  connectDB(config.DB_URL);

  return {
    loggerFactory,
    accountRepository,
    authService,
    emailService: fakeEmailService, // TODO: remove once AWS credentials granted
  };
};

const createApp = () => {
  if (isTesting()) {
    return testApp();
  }
  if (isDevelopment()) {
    return devApp();
  }
  return prodApp();
};

module.exports = { application: createApp() };
