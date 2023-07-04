const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const UnavailableEmailError = require('../errors/UnavailableEmailError');
const { JWT_KEY = '54bc67bb5cc0f214674313e60dbd0e9707a9e7f3b068bdda5b3050e9a83f4ab4' } = process.env;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then(users => res.status(200).send({ data: users }))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { email, password, name, about, avatar } = req.body;

  bcrypt
    .hash(password, 10)
    .then(hash => {
      User.create({ email, password: hash, name, about, avatar })
        .then(user => res.status(201).send({
          data: { email: user.email, name: user.name, about: user.about, avatar: user.avatar }
        }))
        .catch(err => next(new UnavailableEmailError('Данный email уже занят')));
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then(user => {
      if (user) res.status(200).send({ data: user });
      else throw new NotFoundError('Пользователь по данному id не найден');
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .then(user => {
      if (user) res.status(200).send({ data: user });
      else throw new NotFoundError('Пользователь по данному id не найден');
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then(user => {
      if (user) res.status(200).send({ data: user });
      else throw new NotFoundError('Пользователь по данному id не найден');
    })
    .catch(next);
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then(user => {
      if (user) res.status(200).send({ data: user });
      else throw new NotFoundError('Пользователь по данному id не найден');
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then(user => {
      const token = jwt.sign({ _id: user._id }, JWT_KEY, { expiresIn: '7d' });
      res.status(200).send({ data: token });
    })
    .catch(next);
};
