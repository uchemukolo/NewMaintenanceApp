import express from 'express';
import request from '../controllers/requests';
import validate from '../middleware/validate';
import auth from '../middleware/Authetication';

const router = express.Router();

router.get(
  '/',
  auth.Verify,
  request.getAll
);
router.get(
  '/:requestId',
  auth.Verify,
  request.getOne
);
router.post(
  '/', auth.Verify,
  validate.createRequest,
  request.createRequest
);
router.put(
  '/:requestId',
  auth.Verify,
  validate.createRequest,
  request.modifyRequest
);


export default router;
