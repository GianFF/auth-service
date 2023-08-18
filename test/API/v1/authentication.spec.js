const request = require('supertest');
const { connectDB, dropDB, dropCollections } = require('../../connection');
const config = require('../../../src/config');
config.NODE_ENV = 'test';
const { app } = require('../../../src/app');
const { application } = require('../../../src/application');

// Mock console.log to do nothing:
require('../../loggerMock');

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await dropDB();
});

describe('SignUp', () => {
  beforeEach(async () => {
    await dropCollections();
  });

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
    expect(user.password).toBe(password);
    expect(user.verificationCode).toBeTruthy();
    expect(user.status).toBe('Unverified');
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
  });
});