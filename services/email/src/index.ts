import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { getEmails, sendEmail } from './controllers'
import './receiver'



dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
    res.status(200).json({ status: "UP" });
});



// Route

app.post('/emails/send', sendEmail);
app.get('/emails', getEmails);




// // 404 handler
app.use((_req, res) => {
    res.status(404).json({ message: "not found" });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal server error" });
});

const port = process.env.PORT || 3002;
const serviceName = process.env.SERVICE_NAME || 'Email-Service';

app.listen(port, () => {
    console.log(`${serviceName} is running port ${port}`);
});


