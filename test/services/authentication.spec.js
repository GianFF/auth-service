const { restoreMocks } = require('../restoreMocks');
const { signup } = require('../../src/services/authentication');
const { accountRepository } = require('../../src/repositories/account');
const { fakeEmailService } = require('../../src/services/fakeEmail');

describe('SignUp', () => {
  let sendVerificationEmailSpy;
  let saveSpy;
  let findByEmailSpy;

  beforeEach(() => {
    saveSpy = jest.spyOn(accountRepository, 'save').mockImplementation(() => {});
    findByEmailSpy = jest.spyOn(accountRepository, 'findByEmail').mockImplementation(() => {});
    sendVerificationEmailSpy = jest.spyOn(fakeEmailService, 'sendVerificationEmail');
  });

  afterEach(() => {
    restoreMocks();
  });

  const subject = async () => {
    await signup({
      email: 'test@example.com',
      password: 'testpassword',
      accountRepository,
      emailService: fakeEmailService,
      logger: console
    });
  };

  it('should create a new user and send a verification email', async () => {
    await subject();

    expect(findByEmailSpy).toHaveBeenCalled();
    expect(saveSpy).toHaveBeenCalled();
    expect(sendVerificationEmailSpy).toHaveBeenCalled();
  });

  it('should return 204 status with message if email is already taken', async () => {
    findByEmailSpy = jest.spyOn(accountRepository, 'findByEmail')
      .mockImplementation(() => Promise.resolve({ email: 'test@example.com' }));

    await expect(subject()).rejects.toThrow('Email already taken');

    expect(findByEmailSpy).toHaveBeenCalled();
    expect(saveSpy).not.toHaveBeenCalled();
    expect(sendVerificationEmailSpy).not.toHaveBeenCalled();
  });

  it('should return 204 status with message if any action fails', async () => {
    saveSpy = jest.spyOn(accountRepository, 'save')
      .mockImplementation(() => Promise.reject('Error while saving!'));

    await expect(subject()).rejects.toThrow('Oops! Something failed, please try again later');

    expect(findByEmailSpy).toHaveBeenCalled();
    expect(saveSpy).toHaveBeenCalled();
    expect(sendVerificationEmailSpy).not.toHaveBeenCalled();
  });
});
