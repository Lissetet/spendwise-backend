const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  user: { type: String, required: true  },
});

module.exports = mongoose.model('Budget', BudgetSchema);