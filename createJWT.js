const jwt = require('jsonwebtoken');

const createJWT = (payload, res) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '3 days',
  });

  res.cookie('circle-animation-token', token, {
    maxAge: 3 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' ? true : false,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
  });
};

module.exports = createJWT;
