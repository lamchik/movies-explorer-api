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
}

const createMovie = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Movie.create({ name, link, owner })
    .then((card) => {
      res.send(card);
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
    .then((card) => {
      if (card === null) {
        next(new NotFoundError('Фильм по указанному id не найден'));
      } else if (JSON.stringify(userId) === JSON.stringify(card.owner)) {
        Card.findByIdAndRemove(id)
          .then(() => {
            res.send({ message: 'карточка удалена' });
          });
      } else {
        next(new ForbiddenError('Ошибка'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Фильм по указанному id не найдена'));
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