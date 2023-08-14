const mongoose = require('mongoose');
const Transaction = require('./Transaction');

const AccountSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { 
    type: String, 
    required: true, 
    enum: [
      'cash',
      'checking', 
      'savings', 
      'investment', 
      'credit',
      'loan', 
      'property',
      'other'
    ], 
    default: 'other' 
  },
  user: { type: String, required: true  },
}, {
  toJSON: { virtuals: true }, 
  id: false
});

AccountSchema.virtual('balance');

AccountSchema.methods.getBalance = async function() {
  const result = await this.model('Account').aggregate([
    {
      $match: {
        _id: this._id
      }
    },
    {
      $lookup: {
        from: 'transactions',
        localField: '_id',
        foreignField: 'account',
        as: 'transactions'
      }
    },
    {
      $project: {
        _id: 1,
        balance: {
          $sum: {
            $map: {
              input: '$transactions',
              as: 'transaction',
              in: '$$transaction.amount' // extract amount from each transaction
            }
          }
        }
      }
    }
  ]);

  this.balance = result[0] ? result[0].balance : 0;
  return this.balance;
};

AccountSchema.post('find', async function(accounts) {
  for (let account of accounts) {
    await account.getBalance();
  }
});

AccountSchema.post('findOne', async function(account) {
  if (account) {
    await account.getBalance();
  }
});

AccountSchema.pre('findOneAndDelete', async function(next) {
  try {
    const id = this._conditions._id;
    await Transaction.deleteMany({ account: id });
    next();
  } catch (error) {
    next(error);
  }
  next()
})

module.exports = mongoose.model('Account', AccountSchema);