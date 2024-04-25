import express from 'express'; 
import { verifyToken } from '../utils/VerifyUser.js'; 
import { create, deletepost, getposts } from '../controllers/post.controller.js';

const router = express.Router(); 

//the verify token below is going to tell us information about the user and more precisely, wether the user isAdmin or not.

router.post('/create', verifyToken, create); 
//for the getposts, we don't need to verify the token because even if you're not signin, you can still access to see the posts. 
router.get('/getposts', getposts); 
router.delete('/deletepost/:postId/:userId', verifyToken, deletepost); 

export default router; 