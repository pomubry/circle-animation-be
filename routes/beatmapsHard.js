const router = require('express').Router();

const HardModel = require('../model/HardModel');

router.post('/', (req, res) => {
  HardModel.insertMany(req.body, (error, doc) => {
    if (error) return res.status(404).json(error);
    res.json(doc);
  });
});

router.get('/', async (req, res) => {
  try {
    const hardBeatmaps = await HardModel.find();
    res.json(hardBeatmaps);
  } catch (error) {
    res.status(404).json(error);
  }
});

module.exports = router;
