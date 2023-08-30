const config = require('./config');
const { connectDB } = require('./database/connection');
const { accountRepository } = require('./repositories/account');
// TODO: remove comment once AWS credentials granted
// const { emailService } = require('./services/email');
const { fakeEmailService } = require('./services/email');
const authService = require('./services/authentication');
const loggerFactory = require('./logger');
const { isTesting, isDevelopment } = require('./environment');
const { fakeUUIDGenerator, prodUUIDGenerator } = require('./uuid');

const testApp = () => ({
  uuidGenerator: fakeUUIDGenerator,
  loggerFactory,
  accountRepository,
  authService,
  emailService: fakeEmailService,
});

const devApp = () => {
  connectDB(config.DB_URL);

  return {
    uuidGenerator: fakeUUIDGenerator,
    loggerFactory,
    accountRepository,
    authService,
    emailService: fakeEmailService,
  };
};

const prodApp = () => {
  connectDB(config.DB_URL);

  return {
    uuidGenerator: prodUUIDGenerator,
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
