process.env.JWT_SECRET = '1e6ad7d2-4687-11ee-be56-0242ac120002';
process.env.COOKIE_SECRET = '96e84d74-4688-11ee-be56-0242ac120002';

const request = require('supertest');
const { connectDB, dropDB, dropCollections } = require('../../connection');
const { app } = require('../../../src/app');
const { application } = require('../../../src/application');
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

      it('and signs the cookie', async () => {
        await subject();

        expect(response.status).toBe(200);
        // TODO: double check what we want to assert here
        expect(response.header['set-cookie']).not.toBeUndefined();
      });
    });

    describe('Returns 401', () => {
      it('when email is not valid', async () => {
        email = 'notexisting@email.com';

        await subject();

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid credentials');
        expect(response.header['set-cookie']).toBeUndefined();
      });
  
      it('when password is not valid', async () => {
        password = 'INVALID';

        await subject();

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid credentials');
        expect(response.header['set-cookie']).toBeUndefined();
      });

      it('when account is not verified', async () => {
        email = 'newEmail@mail.com'
        await application.accountRepository.save({ email, password, verificationCode });

        await subject();

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Verify your account');
        expect(response.header['set-cookie']).toBeUndefined();
      });

      it('when account does not exists', async () => {
        email = 'notexisting@email.com';

        await subject();

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid credentials');
        expect(response.header['set-cookie']).toBeUndefined();
      });
    })
  });
});