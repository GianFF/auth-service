const fakeEmailService = {
  async sendVerificationEmail({ toEmail, verificationCode }) {
    console.log(`Mock: Sending verification email to ${toEmail}. Code: ${verificationCode}`);
    return true;
  },
};

module.exports = { fakeEmailService };
