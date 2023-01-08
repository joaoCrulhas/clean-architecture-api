import { Router } from 'express';

const signupRoutes = (router: Router) => {
  router.post('/signup', (req, res) => {
    res.json({ test: true }).status(200);
  });
};

export { signupRoutes };
