const { asyncHandler } = require('../../middlewares/asyncHandler');
const { signup } = require('../../services/authentication');

const registerAuthRoutes = (router, application) => {
  // TODO:
  // * use https
  // * receive the password in the Request Body
  // * hash the password before sending it
  // * issue a Token after user authentication
  // * protect against CSRF attacks

  router.post('/signup', asyncHandler(async (req, res) => {
    req.logger.log('POST /signup');

    const { email, password } = req.body;
    await signup({
      email, password, ...application, logger: req.logger,
    });
    return res
      .status(200)
      .send({
        message: 'An email was delivered to verify your account, please copy the verification code and complete the signup.',
      });
  }));
};

module.exports = { registerAuthRoutes };
