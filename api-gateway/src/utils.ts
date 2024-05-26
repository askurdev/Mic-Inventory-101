import { Express, Request, Response, NextFunction } from 'express';
import config from './config.json';
import axios from 'axios';
import middlewares from './middlewares';

// Define Middleware type
type Middleware = (req: Request, res: Response, next: NextFunction) => void | Promise<void>;

// Define the type for your middlewares
interface Middlewares {
  [key: string]: Middleware;
}

// Ensure middlewares object is properly typed
const typedMiddlewares: Middlewares = middlewares as Middlewares;

export const createHandler = (
  hostname: string,
  path: string,
  method: string
) => {
  return async (req: Request, res: Response) => {
    try {
      let url = `${hostname}${path}`;
      req.params &&
        Object.keys(req.params).forEach((param) => {
          url = url.replace(`:${param}`, req.params[param]);
        });

      const { data } = await axios({
        method,
        url,
        data: req.body,
        headers: {
          origin: 'http://localhost:8082',
          'x-user-id': req.headers['x-user-id'] || '',
          'x-user-email': req.headers['x-user-email'] || '',
          'x-user-name': req.headers['x-user-name'] || '',
          'x-user-role': req.headers['x-user-role'] || '',
          'user-agent': req.headers['user-agent'],
        },
      });

      res.json(data);
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        return res
          .status(error.response?.status || 500)
          .json(error.response?.data);
      }
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
};

export const getMiddlewares = (names: string[]): Middleware[] => {
  return names.map((name) => typedMiddlewares[name]);
};

export const configureRoutes = (app: Express) => {
  Object.entries(config.services).forEach(([_name, service]) => {
    const hostname = service.url;
    service.routes.forEach((route) => {
      route.methods.forEach((method) => {
        const endpoint = `/api${route.path}`;
        const middleware = getMiddlewares(route.middlewares || []);
        const handler = createHandler(hostname, route.path, method);
        
        // Use type assertion to ensure TypeScript understands the method is valid
        (app as any)[method](endpoint, ...middleware, handler);
      });
    });
  });
};


