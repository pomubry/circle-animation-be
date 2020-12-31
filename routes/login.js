const router = require('express').Router();
const bcrypt = require('bcrypt');

const registerValidate = require('../validation/registerValidate');
const UserModel = require('../model/UserModel.js');
const createJWT = require('../createJWT');

router.post('/', async (req, res) => {
  const { username, password } = req.body;
  let errorMsg = { username: '', password: '' };

  // Validate req.body
  const { error } = registerValidate.validate(req.body, { abortEarly: false });
  if (error) {
    error.details.forEach((err) => (errorMsg[err.context.label] = err.message));
    return res.status(404).json({ error: errorMsg });
  }

  // Check if username already exists
  let usernameExist = await UserModel.findOne({ username });
  if (!usernameExist) {
    errorMsg.username = 'Invalid Username';
    return res.status(404).json({ error: errorMsg });
  }

  // Check if password matched
  let matched = await bcrypt.compare(password, usernameExist.password);
  if (!matched) {
    errorMsg.password = 'Invalid Password';
    return res.status(404).json({ error: errorMsg });
  }

  // jwt/authentication
  createJWT({ id: usernameExist._id }, res);
  const { beatmap } = usernameExist;
  res.json({
    message: { username, beatmap },
  });
});

module.exports = router;
