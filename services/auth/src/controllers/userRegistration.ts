import { Response, Request, NextFunction} from 'express'
import prisma from '@/prisma'
import { UserCreateSchema } from '@/schemas'
import bcrypt from 'bcryptjs';
import axios from 'axios';
import { USER_SERVICE ,EMAIL_SERVICE } from '@/config';


const generateVerificationCode = () => {
    // Get current timestamp in millisecond
    const timestamp = new Date().getTime().toString();

    // Generate a random 2-digit number
    const randomNum = Math.floor(10 + Math.random() * 90);
    // Combine timestamp and random number and extract last 5 digit
    let code = (timestamp + randomNum).slice(-5);

    return code;

}



const userRegistration = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        //Validate the request body
        const parsedBody = UserCreateSchema.safeParse(req.body);
        if (!parsedBody.success) {
            return res.status(400).json({errors: parsedBody.error.errors});
        }

        //check if the user already exists

        const existingUser = await prisma.user.findFirst({
            where: {
                email: parsedBody.data.email,
            }, 
        }) ;
        
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists'});
        }

        // hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(parsedBody.data.password, salt);

        // create the auth user
        const user = await prisma.user.create({
            data: {
                ...parsedBody.data,
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                status: true,
                verified: true
            }
        })

        console.log('User Created: ', user);

        // create the user profile by calling the user service

        await axios.post(`${USER_SERVICE}/users`, {
            authUserId:user.id,
            name:user.name,
            email:user.email,
        });
        

        // Generate Verification code
        const code = generateVerificationCode();
        await prisma.verificationCode.create({
            data: {
                userId: user.id,
                code,
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), //24 hours
            },
        });

        
        // send verification email
            await axios.post(`${EMAIL_SERVICE}/emails/send`, {
                recipient: user.email,
                subject: 'Email verification',
                body: `Your Verification code is ${code}`,
                source: 'user-registration'
            });

        return res.status(201).json({
            message: 'User created. Check your email for verification code',
            user,
        });
        } catch (error) {
        next(error);
    }
};

export default userRegistration;

