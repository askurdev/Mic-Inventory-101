import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { createProduct, getProductDetails, getProducts } from './controllers';


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
    res.status(200).json({ status: "UP" });
});

// app.use((req, res,next) => {
//     const allowedOrigins = ['http://localhost:8082', 'http://127.0.0.1:8082'];
//     const origin = req.headers.origin || '';

//     if (allowedOrigins.includes(origin)) {
//         res.setHeader('Access-Control-Allow-Origin',origin);
//         next();
//     } else {
//         res.status(403).json({message: 'Forbidden'})
//     }
// })

//routes
app.get('/products/:id', getProductDetails )
app.post('/products', createProduct)
app.get('/products', getProducts);

// // 404 handler
app.use((_req, res) => {
    res.status(404).json({ message: "not found" });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal server error" });
});

const port = process.env.PORT || 3006;
const serviceName = process.env.SERVICE_NAME || 'Product-Service';

app.listen(port, () => {
    console.log(`${serviceName} is running port ${port}`);
});


