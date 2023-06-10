import express from 'express';

import { currentUser } from '@asdfkai/common';

const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req, res) => {
  res.send({
    currentUser: req.currentUser,
  });
});

export { router as currentUserRouter };
