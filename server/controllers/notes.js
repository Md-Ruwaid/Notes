import express from "express"
import noteModel from "../models/Notes.js"

const router = express.Router()

router.post("/create", async (req,res) =>{
    try {
        const {content} = req.body

        if(content.length == 0){
            return res.status(400).json({
                "msg" : "note cannot be empty"
            })
        }

        await noteModel.create({content})

        return res.status(201).json({
            "msg" : "node added successfully"
        })

    } catch (error) {
          console.log(error);
        res.status(500).json({
            "msg" : "internal server error :("
        })
    }
})

router.get("/get", async (req,res) =>{
    try {
        const notes = await noteModel.find()

        return res.status(200).json({
            "msg" : "Here are all notes",notes
        })
    } catch (error) {
         console.log(error);
        res.status(500).json({
            "msg" : "internal server error :("
        })
    }
})

router.delete("/delete/:id", async (req,res) =>{
    try {
        const {id} = req.params

        const deleteNote = await noteModel.findByIdAndDelete(id)

        if(!deleteNote){
            return res.status(404).json({
                "msg" : "note not found"
            })
        }

        res.status(200).json({
            "msg" : "note deleted succcessfully"
        })

    } catch (error) {
          console.log(error);
        res.status(500).json({
            "msg" : "internal server error :("
        })
    }
})

export default router