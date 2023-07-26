const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
  name: { type: String, required: true },
  balance: { type: Number, required: true },
  type: { 
    type: String, 
    required: true, 
    enum: [
      'checking', 
      'savings', 
      'investment', 
      'cash',
      'loan', 
      'credit',
      'other'
    ], 
    default: 'other' 
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true  },
});

module.exports = mongoose.model('Wallet', WalletSchema);