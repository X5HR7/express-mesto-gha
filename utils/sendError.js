const sendError = (err, res) => {
  switch (err.name) {
    case 'ValidationError':
      res.status(400).send({ message: 'Переданы некорректные данные' });
      break;
    case 'CastError':
      res.status(400).send({ message: 'Передан невалидный id' });
      break;
    case 'NotFoundError':
      res.status(404).send({ message: err.message });
      break;
    case 'AuthDataError':
      res.status(401).send({ message: 'Неправильные почта или пароль' });
      break;
    case 'AuthError':
      res.status(401).send({ message: 'Необходима авторизация' });
      break;
    case 'NoAccessError':
      res.status(403).send({ message: 'Нет прав на удаление карточки' });
      break;
    case 'MongoServerError':
      if (err.code === 11000) res.status(409).send({ message: 'Данный email уже занят' });
      else res.status(500).send({ message: 'На сервере БД произошла ошибка' });
      break;
    default:
      res.status(500).send({ message: 'На сервере произошла ошибка' });
      break;
  }
};

module.exports = { sendError };
