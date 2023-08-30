const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../config');
const { asyncHandler } = require('../../middlewares/asyncHandler');

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
    const account = await application.authService.signin({
      email, password, ...application, logger: req.logger,
    });

    const token = jwt.sign(
      { accountID: account.id }, // Save util info in cookie
      JWT_SECRET,
      {
        algorithm: 'HS256',
        allowInsecureKeySizes: true,
        expiresIn: 86400, // 24 hours
      },
    );
    req.session.token = token;

    return res
      .status(200)
      .send({
        message: 'Successfully signed in',
        acountID: account.id,
        acountRoles: [],
        acountEmail: account.email,
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
};

module.exports = { registerAuthRoutes };
