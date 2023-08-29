const mongoose = require('mongoose');
const { VERIFIED, UNVERIFIED } = require('../constants/accountStatus');

const accountSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verificationCode: { type: String },
  status: {
    type: String,
    default: UNVERIFIED,
    enum: [
      UNVERIFIED,
      VERIFIED,
    ],
  },
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
