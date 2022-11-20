const request = require('supertest');
const app = require('../src/app');
const sequelize = require('../src/config/database');
const { User } = require('../src/user-module/.');

beforeAll(() => sequelize.sync({ force: true }));
beforeEach(() => User.destroy({ truncate: true }));
const validData = {
  username: 'radwa',
  email: 'radwa@gmail.com',
  password: 'P@ssw0rd',
  password_confirmation: 'P@ssw0rd',
  phone_number: '01146627788',
  gender: 'female',
};
const postUser = (user = null) => {
  const data = user ? user : validData;
  return request(app).post('/api/1.0/signup').send(data);
};

describe('Signup Test cases', () => {
  describe('successful test cases', () => {
    it('returns  status_code=201 created when user enters valid signup data', async () => {
      const response = await postUser();
      expect(response.status).toBe(201);
    });
    it('returns success msg when user created', async () => {
      const response = await postUser();
      expect(response.body.data.message).toBe('user created successfully');
    });
    it('ensures user row saved in db', async () => {
      await postUser();
      const count = await User.count();
      expect(count).toBe(1);
    });
    it('ensures user data saved in db correctly', async () => {
      await postUser();
      const [user] = await User.findAll();
      expect(user.email).toBe(validData.email);
      expect(user.username).toBe(validData.username);
      expect(user.phone_number).toBe(validData.phone_number);
      expect(user.gender).toBe(validData.gender);
    });
    it('ensures user password is hashed in the database', async () => {
      await postUser();
      const [user] = await User.findAll();
      expect(user.password).not.toBe('P@ssw0rd');
    });
  });

  describe('failure test cases', () => {
    it.each`
      field             | value                    | expectedMessage
      ${'username'}     | ${null}                  | ${'username must be not null or empty'}
      ${'username'}     | ${' '}                   | ${'username must be not null or empty'}
      ${'username'}     | ${'rad'}                 | ${'username must be between 4 and 40 characters'}
      ${'username'}     | ${`${'rad'.repeat(50)}`} | ${'username must be between 4 and 40 characters'}
      ${'email'}        | ${null}                  | ${'email address must be not null or empty'}
      ${'email'}        | ${'ra.com'}              | ${'email address is not valid'}
      ${'password'}     | ${null}                  | ${'Password should has at least one uppercase , one lower case, one special char, one digit and  must be min 8 '}
      ${'password'}     | ${'abcd8'}               | ${'Password should has at least one uppercase , one lower case, one special char, one digit and  must be min 8 '}
      ${'phone_number'} | ${''}                    | ${'phone number is not valid'}
      ${'phone_number'} | ${'011466255443'}        | ${'phone number is not valid'}
    `(
      'return $expectedMessage when $field is $value',
      async ({ field, value, expectedMessage }) => {
        const user = { ...validData };
        user[field] = value;
        const response = await postUser(user);
        expect(response.body.errors[field]).toBe(expectedMessage);
      }
    );
    it('return the expected error msg when email is duplicated', async () => {
      await postUser();
      const res = await postUser();
      await postUser();
      expect(res.status).toBe(400);
      expect(res.body.errors.email).toBe('email address is already exists!');
    });

    it('returns the expected error msg when passwords do not match', async () => {
      const user = { ...validData };
      user['password_confirmation'] = 'P@ssw0rdd';
      const res = await postUser(user);
      expect(res.status).toBe(400);
      expect(res.body.errors.password_confirmation).toBe(
        'Passwords must be match'
      );
    });
  });
});
