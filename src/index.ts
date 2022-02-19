import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express, { Express } from 'express';
import cookieParser from 'cookie-parser';

import AuthRoutes from './routes/AuthRoutes';
import UserRoutes from './routes/UserRoutes';
import PostRoutes from "./routes/PostRoutes";
import fileUpload from 'express-fileupload';

import { connect } from './database/mongo';

console.clear();

export const runServer = () => {
  const app: Express = express();

  app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));

  app.use([
    fileUpload({
      useTempFiles: true,
    }),
    cookieParser(process.env.CLIENT_ORIGIN),
    express.json(),
    express.urlencoded({ extended: false }),
  ]);

  app.use('/api/auth', AuthRoutes);
  app.use('/api/user', UserRoutes);
  app.use('/api/post', PostRoutes);

  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT} 🚀`);
  });

  return app;
};

connect(process.env.DB_URI)
  .then(() => {
    runServer();
  })
  .catch((err) => console.log('failure on starting server', err));
