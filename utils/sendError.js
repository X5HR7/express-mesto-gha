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
    default:
      res.status(500).send({ message: 'На сервере произошла ошибка' });
      break;
  }
};

module.exports = { sendError };
