const bcrypt = require('bcrypt');
const HTTPError = require('../errors/httpError');
const { VERIFIED } = require('../constants/accountStatus');

const signup = async ({
  email,
  password,
  accountRepository,
  emailService,
  uuidGenerator,
  logger,
}) => {
  logger.log(`New signup attempt from ${email}`);

  const existingAccount = await accountRepository.findByEmail({ email });

  if (existingAccount) {
    logger.log(`Email already taken: ${email}`);
    throw new HTTPError('Email already taken', 409);
  }

  const verificationCode = uuidGenerator.generate();

  try {
    // TODO: decrypt crypted password and bcrypt before saving.
    const cryptedPassword = bcrypt.hashSync(password, 8);
    // NOTE: if "save" works but "sendVerificationEmail" don't, an inconsistency issue will arrise.
    await accountRepository.save({ email, password: cryptedPassword, verificationCode });
    logger.log(`New account saved for ${email}`);
    await emailService.sendVerificationEmail({ toEmail: email, verificationCode, logger });
    logger.log(`Verification email sent to ${email}`);
  } catch (error) {
    throw new HTTPError('Oops! Something failed, please try again later', 500);
  }
};

const signin = async ({
  email,
  password,
  accountRepository,
  logger,
}) => {
  logger.log(`New signin attempt from ${email}`);

  const account = await accountRepository.findByEmail({ email });

  if (!account) {
    logger.log(`Invalid sign in attempt from ${email}. Invalid account`);
    throw new HTTPError('Invalid credentials', 401);
  }

  if (account.status !== VERIFIED) {
    logger.log(`Invalid sign in attempt from ${email}. Unverified`);
    throw new HTTPError('Verify your account', 401);
  }

  const passwordIsValid = bcrypt.compareSync(
    password,
    account.password,
  );
  if (!passwordIsValid) {
    logger.log(`Invalid sign in attempt from ${email}. Invalid password`);
    throw new HTTPError('Invalid credentials', 401);
  }

  return account;
};

const verify = async ({
  email,
  verificationCode,
  accountRepository,
  logger,
}) => {
  logger.log(`Verify attempt from ${email}`);

  const account = await accountRepository.findByEmail({ email });
  if (!account) {
    throw new HTTPError('Invalid credentials', 404);
  }
  if (account.verificationCode !== verificationCode) {
    throw new HTTPError('Invalid verification code', 409);
  }
  await accountRepository.verifyAccount({ email });
  logger.log(`Account verified: ${email}`);
};

module.exports = { signup, signin, verify };
