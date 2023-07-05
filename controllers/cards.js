const DefaultServerError = require('../errors/DefaultServerError');
const NoAccessError = require('../errors/NoAccessError');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const Card = require('../models/card');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then(card => res.status(201).send({ data: card }))
    .catch(err => {
      if (err.name === 'ValidationError') next(new ValidationError('Переданы некорректные данные'));
      else next(new DefaultServerError('На сервере произошла ошибка'));
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then(cards => res.status(200).send({ data: cards }))
    .catch(next);
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then(card => {
      if (!card) throw new NotFoundError('Карточка по данному id не найдена');

      if (card.owner._id.toString() !== req.user._id)
        throw new NoAccessError('Нет прав на удаление карточки');

      Card.findByIdAndDelete(req.params.cardId)
        .then(card => res.status(200).send({ data: card }))
        .catch(next);
    })
    .catch(err => {
      if (err.name === 'CastError') next(new ValidationError('Передан невалидный id'));
      else next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true }
  )
    .then(card => {
      if (card) res.status(200).send({ data: card });
      else throw new NotFoundError('Карточка по данному id не найдена');
    })
    .catch(err => {
      if (err.name === 'CastError') next(new ValidationError('Передан невалидный id'));
      else next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true }
  )
    .then(card => {
      if (card) res.status(200).send({ data: card });
      else throw new NotFoundError('Карточка по данному id не найдена');
    })
    .catch(err => {
      if (err.name === 'CastError') next(new ValidationError('Передан невалидный id'));
      else next(err);
    });
};
