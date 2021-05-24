const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  getMovies,
  createMovie,
  deleteMovieById,
} = require('../controllers/movies');
const { validateIdInParams, validateGetData, validateCreateMovie } = require('../middlewares/validations');

router.get('/', auth, validateGetData, getMovies);
router.post('/', auth, validateCreateMovie, createMovie);
router.delete('/:id', auth, validateIdInParams, deleteMovieById);

module.exports = router;
