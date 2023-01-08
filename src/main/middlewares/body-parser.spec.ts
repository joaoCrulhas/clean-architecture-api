import request from 'supertest';
import { app } from '../config/app';
import { response } from 'express';

describe('BodyParser middleware', () => {
  it('should parse json request', async () => {
    app.post('/test-body-parser', (req, res) => {
      res.send(req.body).status(200);
    });
    const response = await request(app)
      .post('/test-body-parser')
      .send({ name: 'joao' })
      .expect(200);
    expect(response.body.name).toEqual('joao');
  });
});
