const { v4: uuidv4 } = require('uuid');
const HTTPError = require('../errors/httpError');

const signup = async ({
  email, password, accountRepository, emailService, logger,
}) => {
  logger.log(`New signup ${email}`);

  const existingAccount = await accountRepository.findByEmail({ email });

  if (existingAccount) {
    throw new HTTPError('Email already taken', 409);
  }

  const verificationCode = uuidv4();

  try {
    // NOTE: if "save" works but "sendVerificationEmail" don't, an inconsistency issue will arrise.
    await accountRepository.save({ email, password, verificationCode });
    logger.log(`New account saved for ${email}`);
    await emailService.sendVerificationEmail({ toEmail: email, verificationCode, logger });
    logger.log(`Verification email sent to ${email}`);
  } catch (error) {
    throw new HTTPError('Oops! Something failed, please try again later', 500);
  }
};

module.exports = { signup };
