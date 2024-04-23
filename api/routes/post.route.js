import express from 'express'; 
import { verifyToken } from '../utils/VerifyUser.js'; 
import { create } from '../controllers/post.controller.js';

const router = express.Router(); 

//the verify token below is going to tell us information about the user and more precisely, wether the user isAdmin or not.

router.post('/create', verifyToken, create); 

export default router; 