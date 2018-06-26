import express from 'express';
import Validate from '../middleware/validate';
import user from '../controllers/users';

const router = express.Router();


router.post('/signup', Validate.signUp, user.signUp);
router.post('/login', Validate.signIn, user.signIn);


export default router;
