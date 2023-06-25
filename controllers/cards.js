const Card = require('../models/card');
const { sendError } = require('../utils/sendError');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then(card => res.status(201).send({ data: card }))
    .catch(err => sendError(err, res));
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => res.status(200).send({ data: cards }))
    .catch(err => sendError(err, res));
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then(card => {
      if (card) res.status(200).send({ data: card });
      else sendError({ name: 'NotFoundError', message: 'Карточка по данному id не найдена' }, res);
    })
    .catch(err => sendError(err, res));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true }
  )
    .then(card => {
      if (card) res.status(200).send({ data: card });
      else sendError({ name: 'NotFoundError', message: 'Карточка по данному id не найдена' }, res);
    })
    .catch(err => sendError(err, res));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true }
  )
    .then(card => {
      if (card) res.status(200).send({ data: card });
      else sendError({ name: 'NotFoundError', message: 'Карточка по данному id не найдена' }, res);
    })
    .catch(err => sendError(err, res));
};
