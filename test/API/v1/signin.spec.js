process.env.JWT_SECRET = '123';
process.env.AUTH_TOKEN = '123';

const request = require('supertest');
const { connectDB, dropDB, dropCollections } = require('../../connection');
const { app } = require('../../../src/app');
const { application } = require('../../../src/application');
const { mockConsole } = require('../../loggerMock');
const { fakeUUIDGenerator } = require('../../../src/uuid');

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

  describe('SignIn', () => {
    let email = 'test@mail.com';
    let password = 'testpassword';
    const verificationCode = '123';
    let response;
    let account;

    const subject = async () => {
      response = await request(app)
        .post('/v1/signin')
        .send({ email, password });
    };

    beforeEach(async () => {
      await application.authService.signup({
        email,
        password,
        accountRepository: application.accountRepository,
        emailService: application.emailService,
        uuidGenerator: fakeUUIDGenerator,
        logger: console,
      });
      account = await application.accountRepository.verifyAccount({ email });
    });

    describe('Returns 200', () => {
      it('and the logged in account', async () => {
        await subject();

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Successfully signed in');
        expect(response.body.acountID).toBe(account.id);
        expect(response.body.acountRoles).toEqual([]);
        expect(response.body.acountEmail).toBe(account.email);
      });

      it('and the auth token', async () => {
        await subject();

        expect(response.status).toBe(200);
        expect(response.body.authToken).not.toBeUndefined();
      });
    });

    describe('Returns 401', () => {
      it('when email is not valid', async () => {
        email = 'notexisting@email.com';

        await subject();

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid credentials');
        expect(response.body.authToken).toBeUndefined();
      });
  
      it('when password is not valid', async () => {
        password = 'INVALID';

        await subject();

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid credentials');
        expect(response.body.authToken).toBeUndefined();
      });

      it('when account is not verified', async () => {
        email = 'newEmail@mail.com'
        await application.accountRepository.save({ email, password, verificationCode });

        await subject();

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Verify your account');
        expect(response.body.authToken).toBeUndefined();
      });

      it('when account does not exists', async () => {
        email = 'notexisting@email.com';

        await subject();

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid credentials');
        expect(response.body.authToken).toBeUndefined();
      });
    })
  });
});