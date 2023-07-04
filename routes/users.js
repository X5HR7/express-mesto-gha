const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUsers, getUserById, getUser, updateUser, updateUserAvatar } = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUser);
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateUser
);
router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().min(10),
    }),
  }),
  updateUserAvatar
);
router.get(
  '/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().alphanum(),
    }),
  }),
  getUserById
);

module.exports = router;
