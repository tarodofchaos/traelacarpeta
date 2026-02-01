const request = require('supertest');
const app = require('../app');
const { PrismaClient } = require('../generated/client');
const prisma = new PrismaClient();

describe('Auth Endpoints', () => {
  let token;
  const testUser = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'password123'
  };

  afterAll(async () => {
    // Cleanup
    await prisma.user.deleteMany({
      where: { email: testUser.email }
    });
    await prisma.$disconnect();
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  it('should not register user with existing email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('User already exists');
  });

  it('should login existing user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not login with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'wrongpassword'
      });
    
    expect(res.statusCode).toEqual(400);
  });

  it('should access protected route with token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('x-auth-token', token);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.email).toEqual(testUser.email);
  });

  it('should deny access without token', async () => {
    const res = await request(app)
      .get('/api/auth/me');
    
    expect(res.statusCode).toEqual(401);
  });
});
