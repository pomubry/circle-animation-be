const router = require('express').Router();

const NormalModel = require('../model/NormalModel');

router.post('/', (req, res) => {
  NormalModel.insertMany(req.body, (error, doc) => {
    if (error) return res.status(404).json(error);
    res.json(doc);
  });
});

router.get('/', async (req, res) => {
  try {
    const normalBeatmaps = await NormalModel.find();
    res.json(normalBeatmaps);
  } catch (error) {
    res.status(404).json(error);
  }
});

module.exports = router;
