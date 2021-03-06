import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import morgan from 'morgan';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import session from 'express-session';

import logger from './util/logger';
import models from './models';
import {auth as authConfig} from './config';

import homeRouter from './routes/index';
import userRouter from './routes/user';
import teamRouter from './routes/team';

// Setup auth
require('./auth');

const app = express();

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, '/../public')));
app.use(morgan('combined', {stream: logger.stream}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
  secret: authConfig.sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: {},
}));
app.use(passport.initialize());
app.use(passport.session());
// Add user object to locals
app.use((req, res, next) => {
  res.locals.user = req.user; // eslint-disable-line
  next();
});

// Sync database
models.sequelize.sync().then(() => {
  logger.info('Database synced!');
});

app.use(homeRouter);
app.use(userRouter);
app.use(teamRouter);

// Error handling for app
app.use((err, req, res, next) => {
  logger.error('unhandled application error: ', err);
  res.status(500).send(err);
});

export default app;
