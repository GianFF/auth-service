const config = require('./config');
const { connectDB } = require('./database/connection');
const { accountRepository } = require('./repositories/account');
const { emailService } = require('./services/email');
const { fakeEmailService } = require('./services/fakeEmail');
const loggerFactory = require('./logger');
const { isTesting, isDevelopment } = require('./environment');

const testApp = () => ({
  loggerFactory,
  accountRepository,
  emailService: fakeEmailService,
});

const devApp = () => {
  connectDB(config.DB_URL);

  return {
    loggerFactory,
    accountRepository,
    emailService: fakeEmailService,
  };
};

const prodApp = () => {
  connectDB(config.DB_URL);

  return {
    loggerFactory,
    accountRepository,
    emailService,
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
