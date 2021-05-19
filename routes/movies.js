const router = require('express').Router();
const {
  getMovies,
  createMovie,
  deleteMovieById,
} = require('../controllers/movies');
const { validateIdInParams, validateGetData, validateCreateMovie } = require('../middlewares/validations');

router.get('/', validateGetData, getMovies);
router.post('/', validateCreateMovie, createMovie);
router.delete('/:id', validateIdInParams, deleteMovieById);

module.exports = router;
