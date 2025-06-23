const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, unique: true, required: true },
  shortenedUrl: { type: Number, unique: true, required: true },
});

module.exports = mongoose.model('Urls', urlSchema);