const express = require("express")
const crypto = require("node:crypto")
const movies = require("./movies.json")
const cors = require("cors")
const { validateMovie, validatePartialMovie } = require("./movieSchema")
const app = express()

app.use(express.json())

app.use(cors({
    origin: (origin, callback) => {
        const ACCEPTED_ORIGINS = [
            'http://localhost:8080',
            'http://localhost:1234',
            'https://movies.com',
            'https://midu.dev'
        ]

        if (ACCEPTED_ORIGINS.includes(origin)) {
            return callback(null, true)
        }

        if (!origin) {
            return callback(null, true)
        }

        return callback(new Error('Not allowed by CORS'))
    }
}))

app.get("/", (req, res) =>
    res.json({ mess: "Hola munfo" })
)


app.get("/movies", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*")
    const { genre } = req.query
    if (genre) {
        const filteredMovies = movies.filter(movie =>
            movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
        )
        return res.json(filteredMovies)
    }
    res.json(movies)
})

app.post('/movies', (req, res) => {
    const result = validateMovie(req.body)

    if (!result.success) {
        // 422 Unprocessable Entity
        return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    // en base de datos
    const newMovie = {
        id: crypto.randomUUID(), // uuid v4
        ...result.data
    }

    // Esto no sería REST, porque estamos guardando
    // el estado de la aplicación en memoria
    movies.push(newMovie)

    res.status(201).json(newMovie)
})



app.get("/movies/:id", (req, res) => {
    const { id } = req.params
    const movie = movies.find(movie => movie.id === id)
    if (movie) return res.json(movie)

    res.status(404).json({ error: "Movie not found" })

})

app.patch("/movies/:id", (req, res) => {

    const result = validatePartialMovie(req.body)

    if (!result.success) {
        return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const { id } = req.params

    const movieIndex = movies.findIndex(movie => movie.id == id)
    if (movieIndex < 0) return res.status(404).json({ message: "Movie not found" })

    const updateMovie = {
        ...movies[movieIndex],
        ...result.data
    }
    movies[movieIndex] = updateMovie
    return res.json(updateMovie)
})

const PORT = process.env.PORT ?? 1234

app.listen(PORT, (req, res) => console.log(`Server on http://localhost:1234`))