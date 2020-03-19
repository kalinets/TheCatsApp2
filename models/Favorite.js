const mongoose = require('mongoose')

const FavoriteSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  id: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('favorites', FavoriteSchema)
