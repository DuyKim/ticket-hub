import express from 'express';

const router = express.Router();

router.get('/api/users/currentuser', (req, res) => {
  res.send({ user: 'finally, I create a full stack okteto' });
});

export { router as currentUserRouter };
