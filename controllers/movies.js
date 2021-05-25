const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');
const BadRequestError = require('../errors/bad-request-error');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании фильма'));
      } else {
        next(err);
      }
    });
};

const createMovie = (req, res, next) => {
  const owner = req.user._id;
  // const movieId = req.movie._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    owner,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  })
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании фильма'));
      } else {
        next(err);
      }
    });
};

const deleteMovieById = (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  Movie.findById(id)
    .then((movie) => {
      if (movie === null) {
        next(new NotFoundError('Фильм по указанному id не найден'));
      } else if (JSON.stringify(userId) === JSON.stringify(movie.owner)) {
        movie.remove({ id })
          .then(() => {
            res.send({ message: 'фильм был вами удален' });
          })
          .catch((err) => {
            if (err.name === 'ValidationError') {
              next(new BadRequestError('Переданы некорректные данные при удалении фильма'));
            } else {
              next(err);
            }
          });
      } else {
        next(new ForbiddenError('Ошибка'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Неверный id'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovieById,
};
