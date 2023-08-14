const mongoose = require('mongoose');
const Account = require('./Account');
const Budget = require('./Budget');
const Category = require('./Category');
const Transaction = require('./Transaction');

const UserSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
});

UserSchema.pre('findOneAndDelete', async function(next) {
  try {
    const id = this._conditions._id;
    await Account.deleteMany({ user: id });
    await Budget.deleteMany({ user: id });
    await Category.deleteMany({ users: { $all: [id] } });
    await Transaction.deleteMany({ user: id });
    next();
  } catch (error) {
    next(error);
  }
  next()
})

module.exports = mongoose.model('User', UserSchema);