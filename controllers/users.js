const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const ConflictError = require('../errors/conflict-error');
const BadRequestError = require('../errors/bad-request-error');
const UnauthorizedError = require('../errors/authorization-error');

const { NODE_ENV = 'dev' } = process.env;
const { JWT_SECRET = 'DEFAULT_SECRET' } = process.env;

const getMe = (req, res, next) => {
  const id = req.user._id;
  User.findById(id)
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Пользователь по указанному id не найден');
      } else {
        res.send(user);
      }
    })
    .catch((err) => next(err));
};

const createUser = (req, res, next) => {
  const { email, password, name } = { ...req.body };
  console.log(email, password);
  if (!password) {
    next(new BadRequestError('Пароль не может быть пустым'));
    return;
  }

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name,
    })
      .then((user) => {
        res.status(201).send({ data: user.toJSON() });
      })
      .catch((err) => {
        if (err.name === 'MongoError') {
          next(new ConflictError('Пользователь с таким email уже есть в базе'));
        } else {
          next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
        }
      }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const { name, email } = { ...req.body };
  const id = req.user._id;
  User.findByIdAndUpdate(
    id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user === null) {
        next(new NotFoundError('Пользователь по указанному id не найден'));
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      } else {
        next(err);
      }
    });
};

const loginUser = (req, res, next) => {
  const { email, password } = { ...req.body };
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => next(new UnauthorizedError('Неправильный логин или пароль')));
};

module.exports = {
  getMe,
  createUser,
  updateUser,
  loginUser,
};
