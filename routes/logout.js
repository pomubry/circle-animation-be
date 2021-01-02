const router = require('express').Router();
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
  // Check if token exists
  let token = req.cookies['circle-animation-token'];
  if (!token) return res.json({ error: 'Token not found' });

  // Validate token
  try {
    let jwtVerify = jwt.verify(token, process.env.JWT_SECRET);

    // jwt/authentication
    res.cookie('circle-animation-token', 'token', {
      maxAge: 1,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });
    res.json({ message: 'Logged out!' });
  } catch (error) {
    res.status(404).json({ error });
  }
});

module.exports = router;
