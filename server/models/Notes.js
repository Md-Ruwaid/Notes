import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    content: {
         type: String,
        required: true,
        trim: true
    }
}, {timestamps: true})

const noteModel = mongoose.model("notes", noteSchema)

export default noteModel