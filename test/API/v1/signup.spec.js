const request = require('supertest');
const bcrypt = require('bcrypt');
const { connectDB, dropDB, dropCollections } = require('../../connection');
const { app } = require('../../../src/app');
const { application } = require('../../../src/application');
const { UNVERIFIED } = require('../../../src/constants/accountStatus');
const { restoreMocks } = require('../../restoreMocks');
const { mockConsole } = require('../../loggerMock');

describe('Auth', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await dropDB();
  });

  beforeEach(() => {
    mockConsole();
  });

  afterEach(async () => {
    await dropCollections();
  });

  describe('SignUp', () => {
    it('should create a new user and send a verification email', async () => {
      const email = 'test@example.com';
      const password = 'testpassword';

      const response = await request(app)
        .post('/v1/signup')
        .send({ email, password })
        .expect(200);

      expect(response.body.message).toBe('An email was delivered to verify your account, please copy the verification code and complete the signup.');

      const user = await application.accountRepository.findByEmail({ email });
      expect(user).toBeTruthy();
      expect(user.email).toBe(email);
      expect(await bcrypt.compare(password, user.password)).toBe(true);
      expect(user.verificationCode).toBeTruthy();
      expect(user.status).toBe(UNVERIFIED);
    });

    it('should return 409 status with message if email is already taken', async () => {
      const email = 'test@example.com';
      const password = 'testpassword';
      const verificationCode = '123';

      await application.accountRepository.save({ email, password, verificationCode });

      await request(app)
        .post('/v1/signup')
        .send({ email, password })
        .expect(409, { message: 'Email already taken' });
    });

    it('should return 500 status with message if any action fails', async () => {
      const email = 'test@example.com';
      const password = 'testpassword';

      // Mock createAccount to throw an error
      application.accountRepository.save = jest.fn(() => {
        return Promise.reject('Test error');
      });

      await request(app)
        .post('/v1/signup')
        .send({ email, password })
        .expect(500, { message: 'Oops! Something failed, please try again later' });
      restoreMocks();
    });
  });
});