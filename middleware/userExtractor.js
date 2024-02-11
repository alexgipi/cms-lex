import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export default function userExtractor(req, res, next) {
    const authorization = req.get('authorization');
    let token = '';

    if(authorization && authorization.toLowerCase().startsWith('bearer')){
        token = authorization.substring(7);
    }
    
    if(token && token != ''){
        const decodedToken = jwt.verify(token, process.env.SECRET);
        if(!decodedToken.id) {
            return res.status(401).json({ message: 'Token invalid' });
            
        } else {
            req.user = decodedToken;
            next();
        }
    } else {
        return res.status(401).json({ message: 'Token missing' });
    }


}