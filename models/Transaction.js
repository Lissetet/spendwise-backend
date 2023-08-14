const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
  type: { 
    type: String, 
    required: true, 
    enum: ['income', 'expense', 'transfer', 'adjustment'],
    default: 'adjustment'
  },
  user: { type: String, required: true  },
  account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  category: { type: String, required: true, default: 'uncategorized' },
});

module.exports = mongoose.model('Transaction', TransactionSchema);

