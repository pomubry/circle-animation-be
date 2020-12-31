const router = require('express').Router();
const UserModel = require('../model/UserModel');

router.get('/', async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users[0]);
  } catch (error) {
    res.status(404).json({ error });
  }
});

module.exports = router;
