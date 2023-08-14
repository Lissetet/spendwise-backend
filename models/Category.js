const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  alias: { type: String, required: true, unique: true },
  parent: { type: String, enum: [
    'root',
    'auto-transport', 
    'bills-utilities', 
    'business-services', 
    'education', 
    'entertainment', 
    'financial', 
    'food-dining', 
    'gifts-donations', 
    'fees-charges', 
    'home', 
    'income', 
    'investments', 
    'health-fitness', 
    'loans', 
    'misc-expenses', 
    'kids', 
    'shopping', 
    'personal-care', 
    'pets', 
    'taxes', 
    'transfer', 
    'travel', 
    'uncategorized'
  ]},
  user: { type: String },
});

module.exports = mongoose.model('Category', CategorySchema);