const Account = require('../models/account');

const accountRepository = {
  async save({
    email, password, verificationCode, status = undefined,
  }) {
    const newAccount = new Account({
      email, password, verificationCode, status,
    });
    return newAccount.save();
  },
  async findByEmail({ email }) {
    return Account.findOne({ email });
  },
};

module.exports = { accountRepository };
