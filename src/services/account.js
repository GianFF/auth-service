class AccountService {
  constructor({ accountRepository, emailService }) {
    this.accountRepository = accountRepository;
    this.emailService = emailService;
  }

  async findAccountByEmail({ email }) {
    return this.accountRepository.findByEmail({ email });
  }

  async createAccount({ email, password, verificationCode }) {
    return this.accountRepository.save({ email, password, verificationCode });
  }

  async sendVerificationEmail({ email, verificationCode }) {
    return this.emailService.sendVerificationEmail({ email, verificationCode });
  }
}

module.exports = AccountService;
