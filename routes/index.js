const router = require('express').Router();

const userRouter = require('./users');
const moviesRouter = require('./movies');

router.use('/users', userRouter);
router.use('/movies', moviesRouter);

module.exports = router;
