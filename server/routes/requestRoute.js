import express from 'express';
import request from '../controllers/requests';
import validate from '../middleware/validate';

const router = express.Router();

router.get('/', request.getAll);
router.get('/:requestId', request.getOne);
router.post('/', validate.requestData, request.createRequest);
router.put('/:requestId', validate.requestData, request.modifyRequest);


export default router;