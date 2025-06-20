 import bcryptjs from 'bcryptjs'; 
import { errorHandler } from '../utils/error.js';
import User from '../models/user.model.js';

export const test = (req, res) => {
    res.json({ message: 'API is working!'}); 
}; 

export const updateUser = async(req, res, next) => {
    // console.log(req.user); 
    //below, if the user id inside the cookie is not the same with the user _id found inside the web browser by useparams, return error handler....
    if (req.user.id !== req.params.userId){
        return next(errorHandler(403, "Vous n'êtes pas autorisé à mettre à jour cet utilisateur"));
    }

    if (req.body.password){
        if(req.body.password.length < 6){
            return next(errorHandler(400, "Le mot de passe doit contenir au moins 6 caractères")); 
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10); 
    }
    if (req.body.username){
        if(req.body.username.length < 7 || req.body.username.length > 20){
            return next(errorHandler(400, "Le nom d'utilisateur doit comporter entre 7 et 20 caractères"));
        }
        if(req.body.username.includes(' ')){
            return next(errorHandler(400, "Le nom d'utilisateur ne peut pas contenir d'espaces"));
        }
        if(req.body.username !== req.body.username.toLowerCase()){
             return next(errorHandler(400, "Le nom d'utilisateur doit être en minuscules")); 
        }
        if (!req.body.username.match(/^[a-zA-Z0-9]+$/)){
            return next(errorHandler(400, "Le nom d'utilisateur ne peut contenir que des lettres et des chiffres")
        );
        }
    }
        try {
            //we hand to update the user
            const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
                $set: {
                    username: req.body.username, 
                    email:req.body.email, 
                    profilePicture: req.body.profilePicture, 
                    password: req.body.password, 
                },
            }, { new:true }); 
            const {password, ...rest} = updatedUser._doc;
            res.status(200).json(rest); 
        } catch(error){
               next(error); 
        }
    };
export const deleteUser = async(req, res, next) => {
    if(!req.user.isAdmin && req.user.id !== req.params.userId){
       return next(errorHandler(403, "Vous n'êtes pas autorisé à supprimer cet utilisateur"));     
    }
    try {
        await User.findByIdAndDelete(req.params.userId)
        res.status(200).json("L'utilisateur a été supprimé"); 
    } catch(error) {
        next(error); 
    }
}; 

export const signout = (req, res, next) => {
    try {
         res
          .clearCookie('access_token')
          .status(200)
          .json('User has been signed out');
    } catch(error){
           next(error); 
    }
}

export const getUsers = async (req, res, next) => {
    if(!req.user.isAdmin) { 
        return next(errorHandler(403, 'You are not allowed to see all users')); 
    }
    try {
        const startIndex = parseInt(req.query.startIndex) || 0; 
        const limit = parseInt(req.query.limit) || 9; 
        const sortDirection = req.query.sort === 'asc' ? 1 : -1; 

        const users = await User.find()
           .sort({ createdAt: sortDirection })
           .skip(startIndex)
           .limit(limit); 

           const usersWithoutPassword = users.map((user) => {
             const { password, ...rest } = user._doc;
             return rest;  
           }); 

           const totalUsers = await User.countDocuments(); 

           const now = new Date(); 

        //    const oneMonthAgo = new Date(
        //     now.getFullYear(), 
        //     now.getMonth() - 1, 
        //     now.getDate() 
        //    )
        const oneMonthAgo = new Date(
            now.getFullYear(), 
            now.getMonth() - 1, 
            now.getDate() 
           )
           const lastMonthUsers = await User.countDocuments({
            createdAt: {$gte: oneMonthAgo }, 
           }); 

           res.status(200).json({
            users:usersWithoutPassword, 
            totalUsers, 
            lastMonthUsers, 
           })
    } catch(error) {
        next(error)
    }
}

export const getUser = async (req, res, next) => {
    try { 
        const user = await User.findById(req.params.userId); 
        if(!user) {
            return next(errorHandler(404, "Utilisateur non trouvé")); 
        }
        const {password, ...rest} = user._doc; 
        res.status(200).json(rest); 
    } catch(error) {
        next(error); 
    }

}

export const getAdms = async(req, res, next)=>{
    if(!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not allowed to see all the cellcom members')); 
    }
   try {
    const startIndex = parseInt(req.query.startIndex) || 0; 
    const limit = parseInt(req.query.limit) || 9; 
    const sortDirection = req.query.sort === 'asc' ? 1 : -1; 

    const adms = await User.find({isAdmin:true})
    .sort({ createdAt: sortDirection })
    .skip(startIndex)
    .limit(limit); 
 
     const admsWithoutPassword = adms.map((adm) =>{
        const { password, ...rest } = adm._doc; 
        return rest; 
     }); 

     const TotalAdms = await User.countDocuments({isAdmin:true}); 

     const now = new Date(); 

     const oneMonthAgo = new Date(
        now.getFullYear(), 
        now.getMonth() - 1, 
        now.getDate()
     ); 

     const lastMonthAdms = await User.countDocuments({
        createdAt: {$gte: oneMonthAgo }, isAdmin:true,
     }); 

     res.status(200).json({
        adms: admsWithoutPassword, 
        TotalAdms, 
        lastMonthAdms, 
     }); 
   } catch(error) {
     next(error)
   }
}