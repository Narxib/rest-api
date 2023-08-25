import z from "zod"

const movieSchema = z.object({
    title: z.string({
        invalid_type_error: "Movie title must be a string",
        required_error: "Title is required"
    }),
    year: z.number({
        invalid_type_error: "Year must be a number",
        required_error: "Year is required"
    }).int().min(1900).max(2025),
    director: z.string({
        invalid_type_error: "Director must be a string",
        required_error: "Director is required"
    }),
    duration: z.number({
        invalid_type_error: "Duration must be a number",
        required_error: "Duration is required"
    }).int().positive().max(720),
    poster: z.string({
        invalid_type_error: "The poster must be a url with .jpg , .png or .svg extension",
        required_error: "Poster is required"
    }).url().endsWith(".webp"),
    genre: z.array(
        z.enum(['Action', 'Adventure', 'Crime', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Sci-Fi']),
        {
            required_error: 'Movie genre is required.',
            invalid_type_error: 'Movie genre must be an array of enum Genre'
        }
    ),
    rate: z.number({
        invalid_type_error: "Rate must be a number",
        required_error: "Rate is required"
    }).min(0).max(10)
})


export function validateMovie(input) {
    return movieSchema.safeParse(input)
}

export function validatePartialMovie(input) {
    return movieSchema.partial().safeParse(input)
}