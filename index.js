import express, { urlencoded } from "express";
import dotenv from "dotenv"
import cors from "cors"
import db from "./utils/db.js"
import appRoutes from "./routes/user.routes.js"


const app = express()
dotenv.config()

app.use(cors({
    origin: process.env.BASE_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-type', 'Authorization'],
}))

const port = process.env.PORT || 4000

app.use(express.json())
app.use(urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.send('Hello Bhaiya')
})

app.use('/api/v1/users/', appRoutes)

db()

app.listen(port, () => {
    console.log(`Example app listening on ${port}`);
})