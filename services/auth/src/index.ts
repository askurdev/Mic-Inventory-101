import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { userRegistration, verifyEmail, verifyToken } from './controllers';
import userLogin from './controllers/userLogin';



dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
    res.status(200).json({ status: "UP" });
});



// Route

app.post('/auth/register', userRegistration);
app.post('/auth/login', userLogin);
app.post('/auth/verify-token', verifyToken)
app.post('/auth/verify-email', verifyEmail);



// // 404 handler
app.use((_req, res) => {
    res.status(404).json({ message: "not found" });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal server error" });
});

const port = process.env.PORT || 4003;
const serviceName = process.env.SERVICE_NAME || 'Auth-Service';

app.listen(port, () => {
    console.log(`${serviceName} is running port ${port}`);
});


