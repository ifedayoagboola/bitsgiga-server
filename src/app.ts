import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import { errorMiddleware } from './apis/middleware';
import { logger } from './utilities';
import { v1Router } from '@src/apis/routes';
import variables from './variables';

const app = express();
// Configure CORS to explicitly allow known dashboards and handle credentials
const allowedOrigins = [
  variables.app.clientUrl,
  variables.app.clientUrl2,
  variables.app.clientDevUrl,
  variables.app.adminUrl,
  variables.app.adminDevUrl,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3210',
  'http://127.0.0.1:3210'
].filter(Boolean) as string[];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow non-browser/SSR
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

//set express view engine
app.set('view engine', 'ejs');

app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) =>
  res.json({
    status: 'success',
    message: 'Ecommerce server response (develop branch)',
    data: null,
    baseRouter: variables.app.baseRouter
  })
);

app.use(variables.app.baseRouter, v1Router);

app.use(errorMiddleware);

app.use((req, res, _next) =>
  res.status(404).json({
    status: 'error',
    message: 'resource not found',
    path: req.url
  })
);

app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.log(err);
  logger.error(`[UNEXPECTED ERROR] => ${err.message}`);

  return res.status(err.status || 500).send({
    status: 'error',
    message: 'Internal server error'
  });
});

app.get('/healthz', (_req, res) => {
  res.status(200).json({ ok: true });
});

export default app;