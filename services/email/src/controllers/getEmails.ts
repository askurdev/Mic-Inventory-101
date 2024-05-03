import { Request, Response, NextFunction} from 'express';
import prisma from '@/prisma';

const getEmail = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const emails = await prisma.email.findMany();
        res.json(emails);
    } catch (error) {
        next(error)
    }
}

export default getEmail;