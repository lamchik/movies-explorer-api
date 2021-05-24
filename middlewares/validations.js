const { celebrate, Joi } = require('celebrate');
const { ObjectId } = require('mongoose').Types;
const validator = require('validator');

const validateEmail = (value, helpers) => {
  if (validator.isEmail(value)) {
    return value;
  }
  return helpers.message('Невалидный email');
};

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.message('Невалидный URL');
};

const validateObjectId = (value, helpers) => {
  if (ObjectId.isValid(value)) {
    return value;
  }
  return helpers.message('Невалидный id');
};

const validateGetData = celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().max(300).required(),
  }).unknown(),
});

const validateGetMe = celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().max(300).required(),
  }).unknown(),
});

const validateIdInParams = celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().max(300).required(),
  }).unknown(),
  params: Joi.object().keys({
    id: Joi.string().required().custom(validateObjectId),
  }),
});

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validateEmail),
    password: Joi.string().min(8).max(30).required(),
    name: Joi.string().min(2).max(30),
  }),
});

const validateLoginUser = validateCreateUser;

const validateUpdateUser = celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().max(300).required(),
  }).unknown(),
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().custom(validateEmail),
  }),
});

const validateCreateMovie = celebrate({
  body: Joi.object().keys({
    nameRU: Joi.string().required().min(2).max(200),
    nameEN: Joi.string().required().min(2).max(200),
    country: Joi.string().required().min(2).max(200),
    director: Joi.string().required().min(2).max(200),
    duration: Joi.number().required().min(0),
    year: Joi.number().required().min(0).max(2021),
    description: Joi.string().required().min(2),
    image: Joi.string().required().custom(validateURL),
    trailer: Joi.string().required().custom(validateURL),
    thumbnail: Joi.string().required().custom(validateURL),
    movieId: Joi.number().required().min(1),
  }),
});

module.exports = {
  validateGetData,
  validateGetMe,
  validateIdInParams,
  validateCreateUser,
  validateLoginUser,
  validateUpdateUser,
  validateCreateMovie,
};
