const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, min: 6, required: true },
  beatmap: {
    easy: [{ code: String, highestCombo: { type: Number, default: 0 } }],
    normal: [{ code: String, highestCombo: { type: Number, default: 0 } }],
    hard: [{ code: String, highestCombo: { type: Number, default: 0 } }],
  },
});

module.exports = mongoose.model('user', userSchema);
