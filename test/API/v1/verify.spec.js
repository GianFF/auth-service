const request = require('supertest');
// Mocks UUID library before importing anything
const mockUUID = '123';
jest.mock('uuid', () => ({ v4: () => mockUUID }));

const { connectDB, dropDB, dropCollections } = require('../../connection');
const { app } = require('../../../src/app');
const { application } = require('../../../src/application');
const { UNVERIFIED, VERIFIED } = require('../../../src/constants/accountStatus');
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

  describe('Verify', () => {
    let account;
    let response;
    let email = 'test@mail.com';
    let password = 'testpassword';
    let verificationCode = mockUUID;

    beforeEach(async () => {  
      await application.authService.signup({
        email,
        password,
        accountRepository: application.accountRepository,
        emailService: application.emailService,
        uuidGenerator: fakeUUIDGenerator,
        logger: console,
      });
    });

    const subject = async () => {
      response = await request(app)
        .post('/v1/verify')
        .send({ email, verificationCode });
    };

    describe('200', () => {
      it('should return a success message and account must be verified', async () => {
        await subject();

        account = await application.accountRepository.findByEmail({ email });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Successfully verified');
        expect(account.status).toBe(VERIFIED);
      });  
    });

    describe('404', () => {
      it('when account does not exists', async () => {
        const correctEmail = email;
        email = 'NOTtest@mail.com';

        await subject();

        account = await application.accountRepository.findByEmail({ email: correctEmail });
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Invalid credentials');
        expect(account.status).toBe(UNVERIFIED);
      });  
    });

    describe('409', () => {
      it('when verification code does not matches', async () => {
        verificationCode = '321';

        await subject();

        account = await application.accountRepository.findByEmail({ email });
        expect(response.status).toBe(409);
        expect(response.body.message).toBe('Invalid verification code');
        expect(account.status).toBe(UNVERIFIED);
      });  
    });
  });
});