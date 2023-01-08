import request from 'supertest';
import { app } from '../config/app';

describe('Cors middleware', () => {
  it('should enable cors', async () => {
    app.get('/test-cors', (req, res) => {
      res.send().status(200);
    });
    await request(app)
      .get('/test-cors')
      .expect(200)
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-origin', '*');
  });
});
