/*What is it? The "Main Water Pipe" to your database.

What goes in it? The connection logic for PostgreSQL. It uses the pg library to create a Pool that reads your database credentials from the .env file.

Why is it needed? It provides a single, reusable connection to your database that all your other files can import and use to run queries.*/