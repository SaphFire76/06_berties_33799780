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

## Data Validation
### Where Validation Was Applied
I implemented validation using `express-validator` on all routes that accept and process user input (POST requests and specific GET requests with query parameters).

- **Book Search (`/search_result`)**:

    - Applied a max length check (50 characters) to the search query.

- **Adding Books (`/bookadded`)**:

    - **Name:** Restricted to a maximum of 50 characters.

    - **Price:** Restricted to a maximum of 6 digits.

- **User Registration (`/registered`)**:

    - **Email:** Validated to ensure standard email format.

    - **Username:** Enforced a length constraint (min 5, max 20 characters).

    - **Password:** Enforced a minimum length of 8 characters for security.

    - **Last Name:** Restricted to alphabetical characters only.

- **User Login (`/loggedin`)**:

    - **Username:** Checked against the same length constraints (5-20 characters) used in registration before querying the database.

### Where Validation Was Not Applied
Validation was omitted for static GET routes (e.g., `/list`, `/listusers`, `/audit`, `/addbook`, `/login`).

## Reasoning
Validation was applied specifically to these routes because they handle external data entry.

1. **Database Integrity**: The validation rules (max lengths) match the schema constraints of the database columns. This prevents SQL errors related to data truncation or invalid types.

2. **Security & Stability**: By validating the format (Email/Alpha) and length of inputs before they reach the database query stage, we reduce the attack surface for injection attacks and prevent buffer overflow issues.



## Data Sanitisation
### Where Sanitisation Was Applied
I utilized `req.sanitize()` on the majority of user inputs before processing them or storing them in the database. This includes:

- **Search Queries**: The text input for book searches.

- **Book Details**: Name and price fields when adding a new book.

- **User Personal Information**: Username, First Name, Last Name, and Email during registration.

- **Login Credentials**: The username field during the login process.

### Where Sanitisation Was Not Applied
- **Passwords**: I explicitly excluded the `password` field from sanitisation during both Registration (`/registered`) and Login (`/loggedin`).

### Reasoning
- **Prevention of Cross-Site Scripting (XSS)**: The primary goal of sanitisation here is to remove or escape characters that could be interpreted as code (e.g., HTML tags like `<script>`). Since my application echoes user input back to the browser (e.g., "Hello [Name], you are now registered" or "This book is added: [Book Name]"), sanitising these inputs prevents malicious scripts from executing in the client's browser.

- **Password Integrity**: Passwords were not sanitised because sanitisation alters special characters (e.g., changing `<` to `&lt;`). Hashing algorithms (bcrypt) require the exact original string to generate the correct hash. If I sanitised the password, the user would essentially be registering with a different password than they typed, causing login failures later.

---

# Berties Books API Documentation

This API provides access to Berties Books' library. It supports searching by name, filtering by price range, and sorting results.

## Base URL
`https://www.doc.gold.ac.uk/usr/407/`

## Endpoints

### Get Books
`GET /books`

Returns a list of books. If no parameters are provided, it returns all books in the database.

### Query Parameters
You can use any combination of the following parameters to refine your results.

| Parameter   | Type   | Description                                                                 |
| :---        | :---   | :---                                                                        |
| `search`    | String | Searches for books containing this text in the **name**.                    |
| `minprice`  | Number | Filters for books with a price **greater than or equal** to this value.     |
| `max_price` | Number | Filters for books with a price **less than or equal** to this value.        |
| `sort`      | String | Sorts the results. Accepted values: `name`, `price`.                        |

#### Example: `http://localhost:8000/api/books?sort=price&minprice=10`
Gets books of price greater than 10, sorted by price in ascending order.
