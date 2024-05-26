import axios from "axios";
import { Request,Response,NextFunction } from "express";
import { access } from "fs";

const auth = async (req: Request, res: Response,next: NextFunction) => {
    if (!req.headers['authorization']) {
        return res.status(401).json({message: 'Unauthorized'})
    }

    try{

        const token = req.headers['authorization'] ?.split('')[1];
        const {data} = await axios.post('http://localhost:2003/auth/verify-token', {
            accessToken:token,
            headers: {
                ip: req.ip,
                'user-agent' : req.headers['user-agent'],
            },
        });

        req.headers['x-used-id']= data.user.id;
        req.headers['x-used-email']= data.user.email;
        req.headers['x-used-name']= data.user.name;
        req.headers['x-used-role']= data.user.role;

        next();


    } catch (error) {
        console.log('[auth middleware]', error);
        return res.status(401).json({message: 'Unauthorized'})
    }

  
};

const middlewares = {auth};
export default middlewares;