require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const { createUser, loginUser } = require('./controllers/users');
const router = require('./routes');
const errorHandler = require('./middlewares/error-handler');
const { validateCreateUser, validateLoginUser } = require('./middlewares/validations');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const { DB_HOST } = process.env;

mongoose.connect(DB_HOST, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const app = express();
app.use(cors());
app.options('*', cors());

app.use(bodyParser.json());
app.use(requestLogger);
app.post('/signin', validateLoginUser, loginUser);
app.post('/signup', validateCreateUser, createUser);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(router);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('Server started');
});
