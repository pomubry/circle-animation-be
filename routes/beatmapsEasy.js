const router = require('express').Router();

const EasyModel = require('../model/EasyModel');

router.post('/', (req, res) => {
  EasyModel.insertMany(req.body, (error, doc) => {
    if (error) return res.status(404).json(error);
    res.json(doc);
  });
});

router.get('/', async (req, res) => {
  try {
    const easyBeatmaps = await EasyModel.find();
    res.json(easyBeatmaps);
  } catch (error) {
    res.status(404).json(error);
  }
});

module.exports = router;
