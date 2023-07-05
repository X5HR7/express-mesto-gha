const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');
const { JWT_KEY = '54bc67bb5cc0f214674313e60dbd0e9707a9e7f3b068bdda5b3050e9a83f4ab4' } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new AuthError('Некорректный токен'));
    return;
  }

  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(token, JWT_KEY);
  } catch (err) {
    next(new AuthError('Некорректный токен'));
    return;
  }

  req.user = payload;
  next();
};
