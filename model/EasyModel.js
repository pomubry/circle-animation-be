const mongoose = require('mongoose');

const easySchema = mongoose.Schema({
  info: {},
});

module.exports = mongoose.model('easybeatmap', easySchema);
