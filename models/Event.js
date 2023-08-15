const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  day: { type: Number, required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  type: { 
    type: String, 
    required: true, 
    enum: [
      'success',
      'error', 
      'default', 
    ], 
    default: 'default' 
  },
  tag: { type: String, required: true },
  user: { type: String, required: true  },
});

module.exports = mongoose.model('Event', EventSchema);