import request from 'supertest';
import { app } from '@root/app';
import { getId } from '@utils/getId';
import { buildOrderHelper } from '@root/tests/helper/buildOrderHelper';
import { OrderStatus } from '@asdfkai/common';
import { stripe } from '@root/stripe';
import { Payment } from '@models/payment';

test('should return a 404 when purchasing an order that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'asdf',
      orderId: getId(),
    })
    .expect(404);
});

test('should return a 401 when purchasing an order that doesnt belong to the user', async () => {
  const order = await buildOrderHelper();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'asdf',
      orderId: order.id,
    })
    .expect(401);
});

test('should return a 400 when purchasing a cancelled order', async () => {
  const userId = getId();
  const cookie = global.signin(userId);
  const order = await buildOrderHelper(userId);
  order.set({ status: OrderStatus.Cancelled });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      token: 'asdf',
      orderId: order.id,
    })
    .expect(400);
});

test('should return a 201 with valid inputs', async () => {
  const userId = getId();
  const price = Math.floor(Math.random() * 10_000);
  const cookie = global.signin(userId);
  const order = await buildOrderHelper(userId, price);

  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(201);

  const stripeCharges = await stripe.charges.list({ limit: 50 });
  const stripeCharge = stripeCharges.data.find(
    (charge) => charge.amount === price * 100
  );

  expect(stripeCharge).toBeDefined();
  expect(stripeCharge?.currency).toEqual('usd');

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id,
  });

  expect(payment).not.toBeNull();
});
