import express from 'express'; 
import { deleteUser, getAdms, getUser, getUsers, signout, test, toggleCellCom, updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/VerifyUser.js';


const router = express.Router(); 

router.get('/test', test); 
router.put('/update/:userId', verifyToken, updateUser); 
router.delete('/delete/:userId', verifyToken, deleteUser); 
router.post('/signout', signout); 
router.get('/getadms', verifyToken, getAdms); 
router.get('/getusers', verifyToken, getUsers); 
router.get('/:userId', getUser); 

// Toggle isAdmin status
router.put('/:id/toggle-admin', verifyToken, toggleCellCom);



export default router; 