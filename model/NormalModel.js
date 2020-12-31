const mongoose = require('mongoose');

const normalSchema = mongoose.Schema({
  info: {},
});

module.exports = mongoose.model('normalbeatmap', normalSchema);
