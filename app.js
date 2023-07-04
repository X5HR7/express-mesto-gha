const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { sendError } = require('./utils/sendError');

const { PORT = 3000, DB_CONNECT_ADDRESS = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

mongoose
  .connect(DB_CONNECT_ADDRESS, {
    useNewUrlParser: true,
  })
  .then(() => console.log('connected to db'))
  .catch(err => console.log(`Ошибка: ${err.message}`));

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.post('/signin', login);
app.post('/signup', createUser);

app.use((req, res) => {
  res.status(404).send({ message: 'Ресурс не найден' });
});

app.use(errors());

app.use((err, req, res, next) => {
  if (err && err.statusCode) res.status(err.statusCode).send({ message: err.message });
  else sendError(err, res);
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
