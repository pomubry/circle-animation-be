const router = require('express').Router();

const EasyModel = require('../model/EasyModel');
const NormalModel = require('../model/NormalModel');
const HardModel = require('../model/HardModel');

router.get('/', async (req, res) => {
  try {
    const easy = await EasyModel.find();
    const normal = await NormalModel.find();
    const hard = await HardModel.find();
    res.json({ easy, normal, hard });
  } catch (error) {
    res.json({ error });
  }
});

module.exports = router;
