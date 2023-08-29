const Account = require('../models/account');
const { VERIFIED } = require('../constants/accountStatus');

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
  async verifyAccount({ email }) {
    const account = await Account.findOne({ email });
    if (!account) {
      throw Error('Not existing account');
    }
    account.status = VERIFIED;
    return account.save();
  },
};

module.exports = { accountRepository };
