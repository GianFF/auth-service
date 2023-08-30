const bcrypt = require('bcrypt');
const { restoreMocks } = require('../restoreMocks');
const { signup, signin } = require('../../src/services/authentication');
const { accountRepository } = require('../../src/repositories/account');
const { fakeEmailService } = require('../../src/services/email');
const { VERIFIED, UNVERIFIED } = require('../../src/constants/accountStatus');
const { fakeUUIDGenerator } = require('../../src/uuid');
const { mockConsole } = require('../loggerMock');

describe('Auth Service', () => {
  beforeEach(() => {
    mockConsole();
  });

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
        uuidGenerator: fakeUUIDGenerator,
        logger: console
      });
    };
  
    it('should create a new user and send a verification email', async () => {
      await subject();
  
      expect(findByEmailSpy).toHaveBeenCalled();
      expect(saveSpy).toHaveBeenCalled();
      expect(sendVerificationEmailSpy).toHaveBeenCalled();
    });
  
    it('should throw an error if email is already taken', async () => {
      findByEmailSpy = jest.spyOn(accountRepository, 'findByEmail')
        .mockImplementation(() => Promise.resolve({ email: 'test@example.com' }));
  
      await expect(subject()).rejects.toThrow('Email already taken');
  
      expect(findByEmailSpy).toHaveBeenCalled();
      expect(saveSpy).not.toHaveBeenCalled();
      expect(sendVerificationEmailSpy).not.toHaveBeenCalled();
    });
  
    it('should throw an error if any action fails', async () => {
      saveSpy = jest.spyOn(accountRepository, 'save')
        .mockImplementation(() => Promise.reject('Error while saving!'));
  
      await expect(subject()).rejects.toThrow('Oops! Something failed, please try again later');
  
      expect(findByEmailSpy).toHaveBeenCalled();
      expect(saveSpy).toHaveBeenCalled();
      expect(sendVerificationEmailSpy).not.toHaveBeenCalled();
    });
  });

  describe('SignIn', () => {
    let findByEmailSpy;
    let compareSyncSpy;
    let findByEmailMock;
    let compareSyncMock;
    let email = 'test@example.com';
    let password = 'testpassword';
    let account;
  
    beforeEach(() => {
      account = undefined;
      compareSyncMock = () => true;
      findByEmailMock = () => Promise.resolve({
        email,
        password,
        status: VERIFIED,
      });
    });

    afterEach(() => {
      restoreMocks();
    });

    const subject = async () => {
      compareSyncSpy = jest
        .spyOn(bcrypt, 'compareSync')
        .mockImplementation(compareSyncMock);

      findByEmailSpy = jest
        .spyOn(accountRepository, 'findByEmail')
        .mockImplementation(findByEmailMock);

      account = await signin({
        email,
        password,
        accountRepository,
        uuidGenerator: fakeUUIDGenerator,
        logger: console,
      });
    };

    it('should return account when succeed', async () => {
      await subject();
  
      expect(findByEmailSpy).toHaveBeenCalled();
      expect(compareSyncSpy).toHaveBeenCalled();
      expect(account.email).toEqual(email);
    });

    it('should throw an error if account does not exists', async () => {
      findByEmailMock = () => Promise.resolve(undefined);

      await expect(subject()).rejects.toThrow('Invalid credentials');
  
      expect(findByEmailSpy).toHaveBeenCalled();
      expect(compareSyncSpy).not.toHaveBeenCalled();
      expect(account).toBeUndefined();
    });

    it('should throw an error if password does not matches', async () => {
      compareSyncMock = () => false;

      await expect(subject()).rejects.toThrow('Invalid credentials');
  
      expect(findByEmailSpy).toHaveBeenCalled();
      expect(compareSyncSpy).toHaveBeenCalled();
      expect(account).toBeUndefined();
    });

    it('should throw an error if account is not verified', async () => {
      compareSyncMock = () => false;
      findByEmailMock = () => Promise.resolve({
        email,
        password,
        status: UNVERIFIED,
      });

      await expect(subject()).rejects.toThrow('Verify your account');
  
      expect(findByEmailSpy).toHaveBeenCalled();
      expect(compareSyncSpy).not.toHaveBeenCalled();
      expect(account).toBeUndefined();
    });
  });
});
