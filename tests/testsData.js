const specificDate = new Date('2023-07-27T12:34:56');

const users = [
  {
    firstName: 'Test',
    lastName: 'User',
    email: 'testuser@example.com',
    password: 'testpassword',
  },
  {
    firstName: 'Test2',
    lastName: 'User2',
    email: 'testuser2@example.com',
    password: 'testpassword2',
  }
];

const wallets = [
  {
    name: 'Test Wallet',
    balance: 1000,
    type: 'checking',
  },
  {
    name: 'Test Wallet 2',
    balance: 2000,
    type: 'savings',
  }
];

const budgets = [
  {
    name: 'Test Budget',
    amount: 1000,
    start_date: new Date('2023-07-01T00:00:00'),
    end_date: new Date('2023-07-10T00:00:00'),
  },
  {
    name: 'Test Budget 2',
    amount: 2000,
    start_date: new Date('2023-07-01T00:00:00'),
    end_date: new Date('2023-08-01T00:00:00'),
  }
];

const categories = [
  { name: 'Test Category 1'},
  { name: 'Test Category 2'},
];

const transactions = [
  {
    amount: 100,
    description: 'Test Transaction',
    date: new Date('2023-07-01T00:00:00'),
    type: 'expense',
  },
  {
    amount: 200,
    description: 'Test Transaction 2',
    date: new Date('2023-07-01T00:00:00'),
    type: 'income',
  },
  {
    amount: 300,
    description: 'Test Transaction 3',
    date: new Date('2023-07-01T00:00:00'),
    type: 'transfer',
  },
  {
    amount: 400,
    description: 'Test Transaction 4',
    date: new Date('2023-07-01T00:00:00'),
    type: 'adjustment',
  },
  {
    amount: 500,
    description: 'Test Transaction 5',
    date: new Date('2023-07-01T00:00:00'),
    type: 'other',
  },
  {
    amount: 600,
    description: 'Test Transaction 6',
    date: new Date('2023-07-01T00:00:00'),
    type: 'expense',
  },
  {
    amount: 700,
    description: 'Test Transaction 7',
    date: new Date('2023-07-01T00:00:00'),
    type: 'income',
  },
  {
    amount: 800,
    description: 'Test Transaction 8',
    date: new Date('2023-07-01T00:00:00'),
    type: 'transfer',
  },
];

module.exports = {
  users,
  wallets,
  budgets,
  categories,
  transactions,
};
