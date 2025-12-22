import jwt from 'jsonwebtoken'; 
import { errorHandler } from './error.js'; 

export const verifyToken = (req, res, next) => {

    const token = req.cookies.access_token; 

    if(!token) {       
       return next (errorHandler(401, 'Vérification de l’utilisateur connecté en cours... Votre session a expiré. Reconnectez-vous avec une adresse e-mail et un mot de passe valides.')); 
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err) {
            return next(errorHandler(401, 'Vérification de l’utilisateur connecté en cours... Votre session a expiré. Reconnectez-vous avec une adresse e-mail et un mot de passe valides.')); 
        }
        req.user = user; 
        next(); 
    })
}; 