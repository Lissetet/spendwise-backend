const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  subject: { type: String, required: false },
  message: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: [
      'help', 
      'bug', 
      'suggestion',
      'other',
      'feedback'
    ] 
  },
  user: { type: String, required: true  },
  rating: { type: Number, required: false },
});

module.exports = mongoose.model('Message', MessageSchema);