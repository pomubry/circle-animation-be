const router = require('express').Router();
const jwt = require('jsonwebtoken');
const UserModel = require('../model/UserModel');

router.get('/', async (req, res) => {
  // Check if token exists
  let token = req.cookies['circle-animation-token'];
  if (!token) return res.json({ error: 'Token not found' });

  // Validate token
  try {
    let jwtVerify = jwt.verify(token, process.env.JWT_SECRET);
    let user = await UserModel.findById(jwtVerify.id);
    res.json({ message: `You are ${user.username}`, jwtVerify });
  } catch (error) {
    res.status(404).json({ error });
  }
});

module.exports = router;
