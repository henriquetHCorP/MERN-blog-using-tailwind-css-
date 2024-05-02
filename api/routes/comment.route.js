import express from 'express'; 
import { verifyToken } from '../utils/VerifyUser.js'
import { createComment, getPostComments, likeComment } from '../controllers/comment.controller.js';

const router = express.Router(); 

router.post('/create', verifyToken, createComment); 
router.get('/getPostComments/:postId', getPostComments); 
router.put('/likeComment/:commentId', verifyToken, likeComment); 

export default router; 