import express from 'express';

const router = express.Router();

router.get('/api/users/currentuser', (req, res) => {
  res.send({
    user: 'I change something in source code but dont redeploy in the cloud. Do its content change in cloud?',
  });
});

export { router as currentUserRouter };
