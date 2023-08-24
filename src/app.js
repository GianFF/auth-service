const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const { application } = require('./application');
const { initV1 } = require('./API/v1');
const { errorHandler } = require('./middlewares/errorHandler');
const { logger } = require('./middlewares/logger');
const { COOKIE_SECRET } = require('./config');

const app = express();

app.use(logger(application.loggerFactory));

app.use(cors({
  origin: ['http://localhost:8081'],
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  cookieSession({
    name: 'cookie-session',
    keys: [COOKIE_SECRET],
    httpOnly: true,
  }),
);
app.use((_, res, next) => {
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, Content-Type, Accept',
  );
  next();
});
app.use((req, _, next) => {
  req.logger.log(`${req.method} ${req.originalUrl}`);
  next();
});
app.use('/v1', initV1(application));
app.get('/healthcheck', (_, res) => res.status(200).send({ message: 'Server healthy' }));
app.use(errorHandler);

module.exports = { app };
