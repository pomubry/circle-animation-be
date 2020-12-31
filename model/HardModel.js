const mongoose = require('mongoose');

const hardSchema = mongoose.Schema({
  info: {},
});

module.exports = mongoose.model('hardbeatmap', hardSchema);
