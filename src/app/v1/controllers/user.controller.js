"use strict";

import Users from "../modals/user.modals.js";
import { StatusCodes } from "http-status-codes";
import { formatSongsData, groupTracksByPlaylist, optimizeApiResponse } from "../utils/functions.js";

//Search Artists
export const fetchArtists = async (_req, res) => {
  try {
    const artists = await Users.getArtists();
    return res.status(StatusCodes.OK).json({ Artists: artists });
  } catch (err) {
    console.log(err);
  }
};

//fetch albums based on Artist Id, search
export const fetchAlbums = async (req, res) => {
  const { artistId, searchWord } = req.query;
  try {
    const Albums = await Users.getAlbums(artistId, searchWord);
    return res.status(StatusCodes.OK).send({ Albums: Albums });
  } catch (err) {
    console.log(err);
  }
};

//fetch songs based on Album Id, search
export const fetchSongs = async (req, res) => {
  const { albumId, searchWord } = req.query;

  let whereQuery = "where 1 = 1 ";
  let params = [];

  if (albumId != null) {
    whereQuery += "and a.Album_ID = ?";
    params.push(albumId);
  }

  if (searchWord != null) {
    whereQuery += "and t.Name like ?";
    params.push(`%${searchWord}%`);
  }
  try {
    const songs = await Users.getSongs(whereQuery, params);
    return res.status(StatusCodes.OK).send(formatSongsData(songs));
  } catch (err) {
    console.log(err);
  }
};

// Fetch playlists based on User ID, search, and include tracks
export const fetchPlaylists = async (req, res) => {
  const { userId, searchWord } = req.query;

  let whereQuery = `WHERE p.Status = 'Public'`;
  let params = [];

  if (userId != null) {
    // Include private playlists for the logged-in user
    whereQuery += ` OR (p.Status = 'Private' AND p.User_ID = ?)`;
    params.push(userId);
  }

  if (searchWord != null) {
    // Search by playlist name
    whereQuery += ` AND p.Name LIKE ?`;
    params.push(`%${searchWord}%`);
  }

  try {
    const playlists = await Users.getPlaylist(whereQuery, params);
    return res.status(StatusCodes.OK).send(playlists);
  } catch (err) {
    console.error('Error fetching playlists:', err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Error fetching playlists');
  }
};

export const fetchPlaylistById = async (req, res) => {
  const { playlistId } = req.query
  try {
    const playlistData = await Users.getPlaylistDetails(playlistId)
    return res.status(StatusCodes.OK).send(groupTracksByPlaylist(playlistData));
  }
  catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Error fetching playlists');
  }
}
//create playlist
export const createPlaylist = async (req, res) => {
  const { name, userId, status, songs } = req.body;
  console.log({ name, userId, status, songs });

  try {
    const insertPlaylist = await Users.createPlaylist(
      name,
      userId,
      status,
      songs
    );
    if (insertPlaylist != 0) {
      res
        .status(StatusCodes.CREATED)
        .json({ message: "Playlist created Successfully" });
    }
  } catch (error) {
    console.log(error);

    return res.status(StatusCodes.OK).json({ message: "Not created" });
  }
};

//delete playlist or a song from playlist
export const deletePlaylist = async (req, res) => {
  const { playlistId, trackId } = req.body;
  try {
    const deletePlaylistResult = await Users.deletePlaylist(
      playlistId,
      trackId
    );
    if (deletePlaylistResult.affectedRows > 0) {
      if (playlistId != null && trackId != null) {
        return res.status(StatusCodes.OK).json({ message: "Song removed" });
      } else if (playlistId != null) {
        return res.status(StatusCodes.OK).json({ message: "Playlist deleted" });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

//delete playlist or a song from playlist
export const updateUser = async (req, res) => {
  const { userId, trackId } = req.body;
  try {
    const updateUserResult = await Users.updateUser(userId, trackId);
    if (updateUserResult.affectedRows > 0) {
      if (userId != null && trackId != null) {
        res
          .status(StatusCodes.OK)
          .json({ message: "Account has been deleted" });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

//fetch songs based on artistId
export const fetchArtistsSongs = async (req, res) => {
  const { artistId } = req.query;
  try {
    const artists = await Users.getArtistSongs(artistId);

    if (!artists || artists.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'No songs found for the artist' });
    }

    const Data = optimizeApiResponse(artists);
    return res.status(StatusCodes.OK).send({ Data });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};

export const toggleLikeTrack = async (req, res) => {
  const { userId, trackId } = req.body;

  if (!userId || !trackId) {
    return res.status(400).json({ message: 'User ID and Track ID are required.' });
  }

  if (!await Users.isTrackExsists(trackId)) {
    return res.status(StatusCodes.NOT_FOUND).send({ message: "Song not found" })
  }

  // First, check if the track is already liked by this user
  const checkResults = await Users.isLiked(userId, trackId)

  if (checkResults.length > 0) {
    const check = await Users.unLike(userId, trackId)
    if (check.affectedRows > 0) {
      return res.status(200).json({ message: 'Track unliked successfully.' });
    }
    else {
      return res.status(500).json({ message: "something went wrong" })
    }
  }
  else {
    const check = await Users.like(userId, trackId)
    if (check.affectedRows > 0) {
      return res.status(200).json({ message: 'Track liked successfully.' });
    }
  }
}


export const fetchLikedTracks = async (req, res) => {
  const { userId } = req.query;
  try {

    const result = await Users.fetchLikedSongs(userId)

    if (result.length > 0) {
      res.status(StatusCodes.OK).json({
        result
      })
    }
    else {
      return res.status(StatusCodes.OK).json({
        message: "No liked Songs", result: result
      })
    }
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something Went Wrong" })
  }

}