# Insert data into the tables

USE berties_books;

INSERT INTO books (name, price)VALUES('Brighton Rock', 20.25),('Brave New World', 25.00), ('Animal Farm', 12.99) ;
INSERT INTO userDetails (username, fname, lname, email, hashedPass) VALUES ('gold','Gold','Smiths','goldsmiths@example.com','$2a$10$qNi1mjRsTZaEM8QRymAOJuEvHq9Kc8PhyqxLd9ut8RjewGdRh0T4i') ;