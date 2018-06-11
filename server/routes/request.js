import express from 'express';
import request from '../controllers/requests';
import Validate from '../middleware/validate';

const router = express.Router();

router.get('/', request.getAll);
router.get('/:requestId', request.getOne);
router.post('/', Validate.createrequest, request.createRequest);
router.put('/:requestId', Validate.createrequest, request.modifyRequest);


export default router;