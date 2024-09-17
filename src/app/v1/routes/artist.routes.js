import { Router } from "express";
import { addTrack, createAlbum, deleteAlbum, deleteTrack } from "../controllers/artist.controller.js";
const artistRoutes = Router();

artistRoutes.post("/create-album", createAlbum)
artistRoutes.delete("/delete-album", deleteAlbum)
artistRoutes.post("/add-track", addTrack)
artistRoutes.delete("/delete-track", deleteTrack)


export default artistRoutes