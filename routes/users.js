const router = require('express').Router();
const auth = require('../middlewares/auth');

const {
  loginUser,
  createUser,
  updateUser,
  getMe,
} = require('../controllers/users');

const {
  validateCreateUser,
  validateLoginUser,
  validateGetMe,
  validateUpdateUser,
} = require('../middlewares/validations');

router.post('/signin', validateLoginUser, loginUser);
router.post('/signup', validateCreateUser, createUser);
router.get('/me', auth, validateGetMe, getMe);
router.patch('/me', auth, validateUpdateUser, updateUser);

module.exports = router;
