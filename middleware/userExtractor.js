import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export default function userExtractor(req, res, next) {
    const authorization = req.get('authorization');
    let token = '';

    if(authorization && authorization.toLowerCase().startsWith('bearer')){
        token = authorization.substring(7);
    }
    
    const decodedToken = jwt.verify(token, process.env.SECRET);
    
    if(!token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' })
    }

    const { id: userId, role, email } = decodedToken;
    req.userId = userId;
    req.userRole = role;
    req.userEmail = email;

    next();

}