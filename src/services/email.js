const AWS = require('aws-sdk');
const config = require('../config');

const emailService = {
  async sendVerificationEmail({ toEmail, verificationCode, logger }) {
    this.ses = new AWS.SES(config.awsConfig);

    const params = {
      Source: config.EMAIL_FROM,
      Destination: { ToAddresses: [toEmail] },
      Message: {
        Body: { Text: { Data: `Hi there, use this code to verify your account: ${verificationCode}` } },
        Subject: { Data: 'Account Verification' },
      },
    };

    try {
      await this.ses.sendEmail(params).promise();
    } catch (error) {
      logger.log(`Email Service ERROR: ${error.message}`);
      throw error;
    }
  },
};

const fakeEmailService = {
  async sendVerificationEmail({ toEmail, verificationCode }) {
    console.log(`Mock: Sending verification email to ${toEmail}. Code: ${verificationCode}`);
    return true;
  },
};

module.exports = {
  emailService,
  fakeEmailService,
};
