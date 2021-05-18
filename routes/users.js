const router = require('express').Router();
const {
  updateUser, getMe,
} = require('../controllers/users');

const {
  validateGetMe,
  validateUpdateUser,
} = require('../middlewares/validations');

router.get('/me', validateGetMe, getMe);
router.patch('/me', validateUpdateUser, updateUser);

module.exports = router;
