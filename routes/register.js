const router = require('express').Router();
const UserModel = require('../model/UserModel.js');
const bcrypt = require('bcrypt');

const registerValidate = require('../validation/registerValidate');
const createJWT = require('../createJWT');
const EasyModel = require('../model/EasyModel');
const NormalModel = require('../model/NormalModel');
const HardModel = require('../model/HardModel');

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
  if (usernameExist) {
    errorMsg.username = 'Username was already taken';
    return res.status(404).json({ error: errorMsg });
  }

  // Hash password
  let hash = await bcrypt.hash(req.body.password, 10);
  req.body.password = hash;

  // Add beatmaps to req.body
  try {
    const easy = await EasyModel.find();
    const normal = await NormalModel.find();
    const hard = await HardModel.find();

    const beatmap = {
      easy: [],
      normal: [],
      hard: [],
    };
    easy.forEach((song) => {
      beatmap.easy.push({ code: song.info.code });
    });
    normal.forEach((song) => {
      beatmap.normal.push({ code: song.info.code });
    });
    hard.forEach((song) => {
      beatmap.hard.push({ code: song.info.code });
    });
    req.body.beatmap = beatmap;

    let user = new UserModel(req.body);
    user.save((error, user) => {
      if (error) return res.status(404).json({ error });

      // jwt/authentication
      createJWT({ id: user._id }, res);
      const { username, beatmap } = user;
      res.json({
        message: { username, beatmap },
      });
    });
  } catch (error) {
    res.json({ error });
  }
});

module.exports = router;
