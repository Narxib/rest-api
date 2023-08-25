import express, { json } from "express"
import { moviesRouter } from "./routes/movies.js"
import { corsMiddleware } from "./middleware/cors.js"
const app = express()
app.use(json())

app.use(corsMiddleware())
app.use("/movies", moviesRouter)

app.get("/", (req, res) => {
    res.json({ message: "landing page" })
})

const PORT = process.env.PORT ?? 1234

app.listen(PORT, (req, res) => console.log(`Server on http://localhost:1234`))