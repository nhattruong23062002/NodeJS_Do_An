const JWT = require('jsonwebtoken');

const generateToken = (user, secret) => {
  const expiresIn = '3d';
  const algorithm = 'HS256';

  return JWT.sign(
    {
      iat: Math.floor(Date.now() / 1000),
      ...user,
      algorithm,
    },
    secret,
    {
      expiresIn,
    })
};

const generateRefreshToken = (id, secret) => {
  const expiresIn = '30d';

  return JWT.sign({ id }, secret, { expiresIn })
};

module.exports = {
  generateToken,
  generateRefreshToken,
};