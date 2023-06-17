import { app } from '@root/app';
import request from 'supertest';
import { Ticket } from '@models/ticket';
import { natsWrapper } from '@root/nats-wrapper';

test('should have a route handler listening to /api/tickets for post request', async () => {
  const response = await request(app).post('/api/tickets').send({});

  expect(response.status).not.toEqual(404);
});

test('should only be accessed if the user is signed in', async () => {
  const response = await request(app).post('/api/tickets').send({});

  expect(response.status).toEqual(401);
});

test('should return a status other than 401 if the user is authenticated', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

test('should return an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 10,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      price: 10,
    })
    .expect(400);
});

test('should return an error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'A valid title is supplied',
      price: -10,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'A valid title is supplied',
    })
    .expect(400);
});

test('should create a new ticket with valid inputs', async () => {
  let tickets = await Ticket.find({});

  expect(tickets.length).toEqual(0);

  const payload = {
    title: 'a valid title',
    price: 20,
  };

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send(payload)
    .expect(201);

  tickets = await Ticket.find({});
  console.log(tickets);

  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(payload.price);
  expect(tickets[0].title).toEqual(payload.title);
});

test('should publish an event', async () => {
  const tickets = await Ticket.find({});

  expect(tickets.length).toEqual(0);

  const payload = {
    title: 'a valid title',
    price: 20,
  };

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send(payload)
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
