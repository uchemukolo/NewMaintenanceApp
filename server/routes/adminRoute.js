import express from 'express';
import admin from '../controllers/admin';
import validate from '../middleware/validate';
import auth from '../middleware/Authetication';

const router = express.Router();

router.get(
  '/',
  auth.Verify,
  auth.Admin,
  admin.getAllRequest
);
router.put(
  '/:requestId/approve',
  auth.Verify,
  auth.Admin,
  validate.checkRequestStatus,
  admin.approveRequest
);
router.put(
  '/:requestId/disapprove',
  auth.Verify, auth.Admin,
  admin.disapproveRequest
);
router.put(
  '/:requestId/resolve',
  auth.Verify,
  auth.Admin,
  validate.checkApproved,
  admin.resolveRequest
);

export default router;
