const request = require('supertest');
const app = require('../src/app');
const sequelize = require('../src/config/database');
const { User } = require('../src/user-module/.');

beforeAll(() => sequelize.sync());
beforeEach(() => User.destroy({ truncate: true }));

describe('User Registeration', () => {
  const postValidUser = () => {
    return request(app).post('/api/1.0/users').send({
      username: 'radwa',
      email: 'radwa@gmail.com',
      password: 'P@ssw0rd',
    });
  };
  it('returns 201 created when user enters valid signup data', async () => {
    const response = await postValidUser();
    expect(response.status).toBe(201);
  });
  it('returns success msg when user created', async () => {
    const response = await postValidUser();
    expect(response.body.data.message).toBe('user created successfully');
  });
  it('ensures user row saved in db', async () => {
    await postValidUser();
    const count = await User.count();
    expect(count).toBe(1);
  });
  it('ensures user email and username saved in db', async () => {
    await postValidUser();
    const [user] = await User.findAll();
    expect(user.email).toBe('radwa@gmail.com');
    expect(user.username).toBe('radwa');
  });

  it('ensures user password is hashed not plain', async () => {
    await postValidUser();
    const [user] = await User.findAll();
    expect(user.password).not.toBe('P@ssw0rd');
  });
});
