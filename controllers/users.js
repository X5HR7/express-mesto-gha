const User = require('../models/user');
const { sendError } = require('../utils/sendError');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.status(200).send({ data: users }))
    .catch(err => sendError(err, res));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(user => res.status(201).send({ data: user }))
    .catch(err => sendError(err, res));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.id)
    .then(user => {
      if (user) res.status(200).send({ data: user });
      else sendError({ name: 'NotFoundError', message: 'Пользователь по данному id не найден' }, res);
    })
    .catch(err => sendError(err, res));
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then(user => {
      if (user) res.status(200).send({ data: user });
      else sendError({ name: 'NotFoundError', message: 'Пользователь по данному id не найден' }, res);
    })
    .catch(err => sendError(err, res));
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then(user => {
      if (user) res.status(200).send({ data: user });
      else sendError({ name: 'NotFoundError', message: 'Пользователь по данному id не найден' }, res);
    })
    .catch(err => sendError(err, res));
};
