const request = require('supertest');
const app = require('../app');
const { PrismaClient } = require('../generated/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

describe('Collection Endpoints', () => {
  let token;
  let user;
  let cardId;

  beforeAll(async () => {
    // 1. Create User
    user = await prisma.user.create({
      data: {
        email: `col_test_${Date.now()}@example.com`,
        password_hash: 'hash',
        name: 'Collection Tester'
      }
    });

    // 2. Generate Token
    token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // 3. Create a Card
    const card = await prisma.card.create({
      data: {
        id: 'col-card-1',
        name: 'Test Card for Collection',
        set_code: 'tst',
        set_name: 'Test Set',
        collector_number: '1',
        rarity: 'common'
      }
    });
    cardId = card.id;
  });

  afterAll(async () => {
    // Cleanup
    await prisma.collectionItem.deleteMany({ where: { user_id: user.id } });
    await prisma.user.delete({ where: { id: user.id } });
    await prisma.card.delete({ where: { id: cardId } });
    await prisma.$disconnect();
  });

  it('should search for cards', async () => {
    const res = await request(app)
      .get('/api/collection/search?q=Test')
      .set('x-auth-token', token);
    
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body[0].name).toContain('Test');
  });

  it('should add a card to collection', async () => {
    const res = await request(app)
      .post('/api/collection')
      .set('x-auth-token', token)
      .send({
        card_id: cardId,
        quantity: 2,
        condition: 'NM'
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.quantity).toEqual(2);
    expect(res.body.user_id).toEqual(user.id);
  });

  it('should increment quantity if same variant added', async () => {
    const res = await request(app)
      .post('/api/collection')
      .set('x-auth-token', token)
      .send({
        card_id: cardId,
        quantity: 1,
        condition: 'NM'
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.quantity).toEqual(3); // 2 + 1
  });

  it('should get user collection', async () => {
    const res = await request(app)
      .get('/api/collection')
      .set('x-auth-token', token);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].card).toBeDefined();
  });

  it('should update an item', async () => {
    // Get item id
    const items = await request(app).get('/api/collection').set('x-auth-token', token);
    const itemId = items.body[0].id;

    const res = await request(app)
      .put(`/api/collection/${itemId}`)
      .set('x-auth-token', token)
      .send({
        quantity: 5,
        is_for_trade: false
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.quantity).toEqual(5);
    expect(res.body.is_for_trade).toEqual(false);
  });

  it('should remove an item', async () => {
    const items = await request(app).get('/api/collection').set('x-auth-token', token);
    const itemId = items.body[0].id;

    const res = await request(app)
      .delete(`/api/collection/${itemId}`)
      .set('x-auth-token', token);
    
    expect(res.statusCode).toEqual(200);

    // Verify gone
    const check = await request(app).get('/api/collection').set('x-auth-token', token);
    expect(check.body.length).toEqual(0);
  });
});
