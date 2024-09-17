"use strict"

import { StatusCodes } from "http-status-codes";
import Artists from "../modals/artists.modals.js";

export const createAlbum = async (req, res) => {
    const { artistId, song, albumName, releaseDate, language } = req.body
    try {
        if (!await Artists.isArtist(artistId)) {
            res.status(StatusCodes.NOT_FOUND).json({ message: " Artist doesnot exist" })
        }
        const result = await Artists.createAlbum(artistId, song, albumName, releaseDate, language)

        if (result.affectedRows > 0) {
            res.status(StatusCodes.OK).json({ message: "Album Created and inserted successfully" })
        }
        else {
            res.status(StatusCodes.SERVICE_UNAVAILABLE).json({ message: "Something went wrong" })
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error Occured" })
    }

}

export const deleteAlbum = async (req, res) => {

    const { albumId, artistId } = req.body
    console.log("Hitted");

    try {
        if (!await Artists.isArtist(artistId)) {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: "Only Artists can delete Album" })
            return false
        }

        if (!await Artists.isAlbumExists(albumId)) {
            res.status(StatusCodes.NOT_FOUND).json({ message: "Album doesnot exist" })
            return false
        }

        if (!await Artists.isAuthorised(artistId, albumId)) {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: "You don't have access to add songs to this Album" })
            return false
        }

        const result = await Artists.deleteAlbum(albumId)
        console.log(result);

        if (result.affectedRows > 0) {
            res.status(StatusCodes.OK).json({ message: "Song Deleted successfully" })
        }
        else {
            res.status(StatusCodes.SERVICE_UNAVAILABLE).json({ message: "Something went wrong" })
        }

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
    }
}

export const addTrack = async (req, res) => {
    const { albumId, artistId, track } = req.body

    try {

        if (!await Artists.isArtist(artistId)) {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: "Only Artists can add songs" })
            return false
        }

        if (!await Artists.isAuthorised(artistId, albumId)) {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: "You don't have access to add songs to this Album" })
            return false
        }

        if (!await Artists.isAlbumExists(albumId)) {
            res.status(StatusCodes.NOT_FOUND).json({ message: "Album doesnot exist" })
            return false
        }

        const result = await Artists.addTrack(albumId, track)

        if (result.affectedRows) {
            res.status(StatusCodes.OK).json({ message: "Song added successfully" })
        }
        else {
            res.status(StatusCodes.SERVICE_UNAVAILABLE).json({ message: "Something went wrong" })
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error, please try again later" })
    }

}

export const deleteTrack = async (req, res) => {
    const { albumId, artistId, trackId } = req.body

    try {
        if (!await Artists.isArtist(artistId)) {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: "Only Artists can delete songs" })
            return false
        }

        if (!await Artists.isAlbumExists(albumId)) {
            res.status(StatusCodes.NOT_FOUND).json({ message: "Album doesnot exist" })
            return false
        }

        if (!await Artists.isTrackExists(trackId)) {
            res.status(StatusCodes.NOT_FOUND).json({ message: "Song doesnot exist" })
            return false
        }

        if (!await Artists.isAuthorised(artistId, albumId)) {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: "You don't have access to add songs to this Album" })
            return false
        }

        const result = await Artists.deleteTrack(trackId)

        if (result.affectedRows > 0) {
            res.status(StatusCodes.OK).json({ message: "Song Deleted successfully" })
        }
        else {
            res.status(StatusCodes.SERVICE_UNAVAILABLE).json({ message: "Something went wrong" })
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error, please try again" })
    }

}


