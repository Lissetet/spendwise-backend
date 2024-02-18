# SpendWise Backend Server

The backend system for Spendwise, a financial management application, is designed to manage financial transactions, budgets, accounts, categories, and events. It provides a RESTful API for creating, reading, updating, and deleting (CRUD) financial data. Built with Node.js, Express, and MongoDB, it utilizes Mongoose for object data modeling to ensure data integrity and provides a structured way to interact with the MongoDB database.


## Getting Started

### Prerequisites
* Node.js
* MongoDB
* npm or yarn

### Installation
1. **Clone the repository to your local machine.**

    ```
    git clone <repository-url>
    ```

2. **Navigate to the project directory.**

    ```
    cd <project-directory>
    ```

3. **Install dependencies.**

    ```
    npm install
    ```
    
     or if you use yarn, 
     
     ```
     yarn install
     ```

4. Set up environment variables. Create a **`.env`** file in the root of your project and add the following variables:

    ```
    PORT=5050
    DATABASE_URL=<your-mongodb-connection-string>
    DEV_DATABASE_URL=<your-development-mongodb-connection-string>
    ```

5. Start the server.

    ```
    npm start
    ``` 
    
    or using yarn, 
    
    ```
    yarn start
    ```


## API Reference

### Accounts
* **GET `/accounts`** - Retrieve all accounts.
* **GET `/accounts/:id`** - Retrieve a single account by ID.
* **POST `/accounts`** - Create a new account.
* **PATCH `/accounts/:id`** - Update an account by ID.
* **DELETE `/accounts/:id`** - Delete an account by ID.

### Budgets
* **GET `/budgets`** - Retrieve all budgets.
* **GET `/budgets/:id`** - Retrieve a single budget by ID.
* **GET `/budgets/find`** - Retrieve budgets by query parameters.
* **POST `/budgets`** - Create a new budget.
* **PATCH `/budgets/:id`** - Update a budget by ID.
* **DELETE `/budgets/:id`** - Delete a budget by ID.

### Categories
* **GET `/categories`** - Retrieve all categories.
* **GET `/categories/:id`** - Retrieve a single category by ID.
* **GET `/categories/find`** - Retrieve categories by query parameters.
* **POST `/categories`** - Create a new category.
* **PATCH `/categories/:id`** - Update a category by ID.
* **DELETE `/categories/:id`** - Delete a category by ID.

### Events
* **GET `/events`** - Retrieve all events.
* **GET `/events/:id`** - Retrieve a single event by ID.
* **POST `/events`** - Create a new event.
* **PATCH `/events/:id`** - Update an event by ID.
* **DELETE `/events/:id`** - Delete an event by ID.

### Messages 
* **GET `/events`** - Retrieve all messages.
* **GET `/events/:id`** - Retrieve a single message by ID.
* **POST `/events`** - Create a new message.
* **DELETE `/events/:id`** - Delete a message by ID.

### Transactions
* **GET `/transactions`** - Retrieve all transactions.
* **GET `/transactions/:id`** - Retrieve a single transaction by ID.
* **GET `/transactions/find`** - Retrieve transactions by query parameters.
* **POST `/transactions`** - Create a new transaction.
* **PATCH `/transactions/:id`** - Update a transaction by ID.
* **DELETE `/transactions/:id`** - Delete a transaction by ID.


## Development

### Running Tests
To run the automated tests for this system, use the following command:

```
npm test
```


## Deployment
This project is set up for basic deployment. For production environments, ensure that your MongoDB connection string (DATABASE_URL) is correctly configured in your environment variables. 

Use the start script for standard environments and dev for development environments, which includes hot reloading via nodemon.

For standard development environments:

```
npm start
```

For development with hot reloading:

```
npm run dev
```

### Environment Variables
Ensure you set up the following environment variables in your .env file:

* **`PORT`**: The port number on which your server will run.
* **`DATABASE_URL`**: Your MongoDB connection string for production.
* **`DEV_DATABASE_URL`**: Your MongoDB connection string for development.

### Dependencies
* **`cors`**: Used to enable CORS with various options.
* **`dotenv`**: Loads environment variables from a .env file into process.env.
* **`express`**: Fast, unopinionated, minimalist web framework for Node.js.
* **`mongoose`**: MongoDB object modeling tool designed to work in an asynchronous environment.
* **`validator`**: A library of string validators and sanitizers.

### DevDependencies
* **`cross-env`**: Run scripts that set and use environment variables across platforms.
* **`jest`**: Delightful JavaScript Testing.
* **`nodemon`**: Utility that will monitor for any changes in your source and automatically restart your server.
* **`supertest`**: Super-agent driven library for testing HTTP servers.


## Authors

### **Liz Trejo**
* [Github](https://github.com/lissetet)
* [Portrfolio](https://liztrejo.dev/)
* [LinkedIn](https://www.linkedin.com/in/liz-trejo/)

## License
This project is licensed under the MIT License - see the LICENSE.md file for details.