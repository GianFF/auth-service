const bcrypt = require('bcrypt');
const { asyncHandler } = require('../../middlewares/asyncHandler');

const registerAuthRoutes = (router, application) => {
  router.post('/signup', asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // TODO: decrypt crypted password and bcrypt before saving.
    const cryptedPassword = bcrypt.hashSync(password, 8);
    await application.authService.signup({
      email, password: cryptedPassword, ...application, logger: req.logger,
    });
    return res
      .status(200)
      .send({
        message: 'An email was delivered to verify your account, please copy the verification code and complete the signup.',
      });
  }));
};

module.exports = { registerAuthRoutes };
