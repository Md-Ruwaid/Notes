import mongoose from "mongoose"
import dotenv from "dotenv"
import { fileURLToPath } from "node:url"

dotenv.config({ path: fileURLToPath(new URL("../../.env", import.meta.url)) })

async function connectDB(uri = process.env.MONGO_URI) {
    if (!uri) {
        throw new Error("MONGO_URI is required. Add it to the project root .env file.")
    }

    await mongoose.connect(uri)
    console.log("Database connected successfully.")
}

export default connectDB