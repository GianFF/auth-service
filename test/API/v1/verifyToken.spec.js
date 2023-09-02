process.env.JWT_SECRET = '123';
process.env.AUTH_TOKEN = '123';

const request = require('supertest');
const jwt = require('jsonwebtoken');
const { connectDB, dropDB, dropCollections } = require('../../connection');
const { app } = require('../../../src/app');
const { application } = require('../../../src/application');
const { restoreMocks } = require('../../restoreMocks');
const { mockConsole } = require('../../loggerMock');
const { fakeUUIDGenerator } = require('../../../src/uuid');

describe('Auth', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await dropDB();
    restoreMocks();
  });

  beforeEach(() => {
    mockConsole();
  });

  afterEach(async () => {
    await dropCollections();
    restoreMocks();
  });

  describe('Verify Token', () => {
    let response;
    let email = 'test@mail.com';
    let password = 'testpassword';
    let verificationCode = fakeUUIDGenerator.generate();
    let authHeader;

    beforeEach(async () => {
      authHeader = `Bearer ${jwt.sign({}, process.env.AUTH_TOKEN, { algorithm: 'HS256' })}`;

      await application.authService.signup({
        email,
        password,
        accountRepository: application.accountRepository,
        emailService: application.emailService,
        uuidGenerator: fakeUUIDGenerator,
        logger: console,
      });
      await application.authService.verify({
        email,
        verificationCode,
        accountRepository: application.accountRepository,
        logger: console,
      });
    });

    const subject = async () => {
      response = await request(app)
        .get('/v1/verifyToken')
        .set('Authorization', authHeader);
    };

    describe('200', () => {
      it('should return a success message', async () => {
        await subject();

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Token verified');
      });  
    });

    describe('401', () => {
      it('when auth header is not set', async () => {
        response = await request(app).get('/v1/verifyToken');

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('No auth header provided');
      });  
    });

    describe('403', () => {
      it('when auth header is invalid', async () => {
        authHeader = `Bearer ${jwt.sign({}, '321', { algorithm: 'HS256' })}`;
        await subject();

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Unauthorized');
      });  
    });
  });
});