const router = require('express').Router();
const jwt = require('jsonwebtoken');

const updateValidate = require('../validation/updateValidate');
const UserModel = require('../model/UserModel.js');

router.put('/', async (req, res) => {
  // Check if token exists
  let token = req.cookies['circle-animation-token'];
  if (!token) return res.json({ error: 'Token not found' });

  // Validate req.body
  const { error } = updateValidate.validate(req.body, { abortEarly: false });
  if (error) return res.status(404).json({ error: 'Invalid request body' });

  // Validate token
  try {
    const { code, difficulty, highestCombo } = req.body;
    let jwtVerify = jwt.verify(token, process.env.JWT_SECRET);
    let diff = difficulty === 1 ? 'easy' : difficulty === 2 ? 'normal' : 'hard';
    const updater = { $set: {} };
    updater['$set'][`beatmap.${diff}.$[elem].highestCombo`] = highestCombo;
    UserModel.findOneAndUpdate(
      { _id: jwtVerify.id },
      updater,
      {
        arrayFilters: [
          { 'elem.highestCombo': { $lt: highestCombo }, 'elem.code': code },
        ],
        useFindAndModify: false,
        new: true,
      },
      (error, doc) => {
        if (error) return res.status(404).json({ error });
        const { beatmap } = doc;
        res.json({
          message: { beatmap },
        });
      }
    );
  } catch (error) {
    res.status(404).json({ error });
  }
});

module.exports = router;
