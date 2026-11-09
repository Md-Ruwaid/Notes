import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { fileURLToPath } from "node:url"
import connectDB from "./config/database.js"
import notesRouter from "./controllers/notes.js"

dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)) })

const app = express()

app.use(cors({
      origin: [
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ]
}))

app.use(express.json())

const port = Number(process.env.PORT || 5000)

app.get("/health", (req,res) =>{
    res.status(200).json({
        "msg" : "APIs are eating apple >_<"
    })
})

app.use("/notes", notesRouter)

async function startServer() {
    await connectDB()
    app.listen(port, () => {
        console.log(`Server is running on port ${port}.`)
    })
}

startServer().catch((error) => {
    console.error("Failed to start the server:", error.message)
    process.exitCode = 1
})