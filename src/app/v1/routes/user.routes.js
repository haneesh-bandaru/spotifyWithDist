import { Router } from "express";
import { createPlaylist, fetchAlbums, fetchArtists, fetchPlaylists, fetchSongs, deletePlaylist, fetchArtistsSongs, fetchPlaylistById, toggleLikeTrack, fetchLikedTracks } from "../controllers/user.controller.js";
const userRoutes = Router();

//route to fetch artists
userRoutes.get("/fetch-artists", fetchArtists)

//route to fetch albums
userRoutes.get("/fetch-albums", fetchAlbums)

//route to fetch songs
userRoutes.get("/fetch-track", fetchSongs)

//route to fetch songs
userRoutes.get("/fetch-artist-track", fetchArtistsSongs)
userRoutes.get("/fetch-playlist-details", fetchPlaylistById)


userRoutes.post('/toggle-like-track', toggleLikeTrack);
userRoutes.get('/fetch-liked-songs', fetchLikedTracks)

//route to fetch playlists
userRoutes.get("/fetch-playlists", fetchPlaylists)

//route to create playlist
userRoutes.post("/create-playlist", createPlaylist)

//route to delete playlist
userRoutes.delete("/delete-playlist", deletePlaylist)

export default userRoutes