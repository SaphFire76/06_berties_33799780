# Berties Books

Sample code for Dynamic Web Applications module.

Uses node.js with Express and EJS.

To install and run:

```
npm install
node index.js
```

## dotenv
1. I first installed dotenv using this command:
```
npm install dotenv
```

2. I then created a `.env` file in the root directory and added the database cretentials within it like so:
```
DB_HOST=localhost
DB_USER=berties_books_app
DB_PASS=qwertyuiop
DB_NAME=berties_books
```

3. I also made sure to add `.env` to my `.gitignore` file.

4. Finally, I changed the code that is used to connect to the databse in `index.js`:
```
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    ...
```

## Restricted Access Routes
- `/books/list`
- `/books/search`
- `/books/addbook`
- `/books/bargainbooks`