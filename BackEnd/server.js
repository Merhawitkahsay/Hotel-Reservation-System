/*What is it? The "General Manager." This is the main entry point that starts your entire server.

What goes in it? Code to create the Express app (const app = express()), connect middleware (app.use(express.json())), link to your routes (app.use('/api', routes)), and start the server (app.listen()).

Why is it needed? It's the file you run (e.g., node server.js) to turn the server on. It's the "conductor" that brings all the other pieces together.*/