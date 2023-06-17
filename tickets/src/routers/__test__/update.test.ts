import request from 'supertest';

import { app } from '@root/app';
import { getId } from '@utils/getId';
import { Ticket } from '@models/ticket';
import { natsWrapper } from '@root/nats-wrapper';

const getPayload = () => ({
  title: 'a valid title',
  price: Math.random() * 20,
});

test('should return a 404 if the provided id does not exist', async () => {
  const id = getId();
  const payload = getPayload();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send(payload)
    .expect(404);
});

test('should return a 401 if the user is not authenticated', async () => {
  const id = getId();
  const payload = getPayload();
  await request(app).put(`/api/tickets/${id}`).send(payload).expect(401);
});

test('should return a 401 if the user does not own the ticket', async () => {
  const payloadOne = getPayload();
  const payloadTwo = getPayload();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send(payloadOne);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send(payloadTwo)
    .expect(401);
});

test('should return a 400 if the user provides an invalid title or price', async () => {
  const cookie = global.signin();
  const payload = getPayload();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send(payload)
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: Math.random() * 100,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: Math.random() * -100,
    })
    .expect(400);
});

test('should update the ticket provided valid inputs successfully', async () => {
  const cookie = global.signin();
  const editedPayload = getPayload();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send(getPayload());

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send(editedPayload)
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual(editedPayload.title);
  expect(ticketResponse.body.price).toEqual(editedPayload.price);
});

test('should publish an update event', async () => {
  const cookie = global.signin();
  const editedPayload = getPayload();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send(getPayload());

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send(editedPayload)
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

test('rejects invalid updates if the ticket is reserved', async () => {
  const cookie = global.signin();
  const editedPayload = getPayload();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send(getPayload());

  const ticket = await Ticket.findById(response.body.id);

  ticket!.set({ orderId: getId() });
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send(editedPayload)
    .expect(400);
});
