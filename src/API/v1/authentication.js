const jwt = require('jsonwebtoken');
const { AUTH_TOKEN } = require('../../config');
const { asyncHandler } = require('../../middlewares/asyncHandler');
const { verifyToken } = require('../../middlewares/verifyToken');

const registerAuthRoutes = (router, application) => {
  router.post('/signup', asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    await application.authService.signup({
      email, password, ...application, logger: req.logger,
    });
    return res
      .status(200)
      .send({
        message: 'An email was delivered to verify your account, please copy the verification code and complete the signup.',
      });
  }));

  router.post('/signin', asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // TODO: investigate other ways to send Password, i.e.: authorization header
    const account = await application.authService.signin({
      email, password, ...application, logger: req.logger,
    });

    const authToken = jwt.sign(
      { accountID: account.id }, // Save util info in cookie
      AUTH_TOKEN,
      {
        algorithm: 'HS256',
        allowInsecureKeySizes: true,
        expiresIn: 3600, // 1 hour
      },
    );

    // TODO: investigate other ways to send AuthTokens, i.e.: cookies:
    // https://dev.to/franciscomendes10866/using-cookies-with-jwt-in-node-js-8fn
    return res
      .status(200)
      .send({
        message: 'Successfully signed in',
        acountID: account.id,
        acountRoles: [],
        acountEmail: account.email,
        authToken,
      });
  }));

  router.post('/verify', asyncHandler(async (req, res) => {
    const { email, verificationCode } = req.body;
    await application.authService.verify({
      email, verificationCode, ...application, logger: req.logger,
    });
    return res
      .status(200)
      .send({ message: 'Successfully verified' });
  }));

  router.use(verifyToken);

  router.get('/verifyToken', (_, res) => res.status(200).send({ message: 'Token verified' }));
};

module.exports = { registerAuthRoutes };
