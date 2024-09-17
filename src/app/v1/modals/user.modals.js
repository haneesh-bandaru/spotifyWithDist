import { poolPromise } from "../utils/dbConnection.js";
import { v1 as uuidv1 } from "uuid";

const pool = await poolPromise;

class Users {
    //method to create playlist
    static async createPlaylist(name, userId, status, songs) {
        let playlistId = uuidv1();
        try {
            const result = await pool.query(
                `INSERT INTO playlists (Playlist_ID, User_ID, Name, Status) VALUES (?,?,?,?)`,
                [playlistId, userId, name, status]
            );
            console.log(result);
            if (songs != null) {
                const values = songs.map((songId, index) => [
                    playlistId,
                    songId,
                    index + 1,
                ]);
                const [results] = await pool.query(
                    "INSERT INTO playlist_tracks (playlist_id,Track_ID, `order`) VALUES ?",
                    [values]
                );
                console.log("Inserted Rows:", results.affectedRows);
            }
            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    }

    // Method to get playlists based on user ID or name and include track details
    static async getPlaylist(whereQuery, params) {
        try {
            const [result] = await pool.query(
                `
            SELECT 
                p.Playlist_ID,
                p.Name AS Playlist_Name,
                p.Status,
                p.image_url as ImageUrl
            FROM 
                Playlists p
            ORDER BY 
                p.Playlist_ID
            ASC;
            `,
            );
            return result;
        } catch (err) {
            throw err;
        }
    }

    static async getPlaylistDetails(playlistId) {
        try {
            const [result] = await pool.query(`
            SELECT 
                p.Playlist_ID,
                p.Name AS Playlist_Name,
                p.Status,
                pt.Track_ID,
                t.Name as TrackName,
                t.Duration,
                t.Path
            FROM 
                Playlists p
            JOIN 
                Playlist_Tracks pt ON p.Playlist_ID = pt.Playlist_ID
            JOIN
	            tracks t ON t.Track_ID = pt.Track_ID
            WHERE 
                p.Playlist_Id = ?
            ORDER BY 
                p.Status
            DESC;`, [playlistId]);
            return result;
        } catch (err) {
            throw err;
        }
    }

    //method to delete playlist
    static async deletePlaylist(playlistId, trackId) {
        let whereQuery = "where 1 = 1 ";
        let params = [];

        if (playlistId != null) {
            whereQuery += "and Playlist_ID = ? ";
            params.push(playlistId);
        }

        if (trackId != null) {
            whereQuery += `and Track_ID = ?`;
            params.push(trackId);
        }
        try {
            let result;
            if (trackId == null) {
                [result] = await pool.query(
                    `DELETE FROM playlist_tracks WHERE playlist_ID = ?`,
                    [playlistId]
                );
                console.log(result);
                [result] = await pool.query(
                    `DELETE FROM playlists WHERE playlist_ID = ?`,
                    [playlistId]
                );
                console.log(result);
            } else {
                [result] = await pool.query(
                    `DELETE FROM playlist_tracks ${whereQuery}`,
                    params
                );
            }
            return result;
        } catch (error) {
            throw error;
        }
    }

    //method to get artists
    static async getArtists() {
        try {
            const [result] = await pool.query(`SELECT Artist_ID,Name,Genre,profile_image as ProfileImage FROM Artists ORDER BY Artist_ID DESC`);
            return result;
        } catch (err) {
            throw err;
        }
    }

    //method to get albums based on artist id
    static async getAlbums(artistId, searchWord) {
        let whereQuery = "where 1 = 1 ";
        let params = [];

        if (artistId != null) {
            whereQuery += "and a.Album_ID = ?";
            params.push(artistId);
        }

        if (searchWord != null) {
            whereQuery += "and t.Name like ?";
            params.push(`%${searchWord}%`);
        }
        try {
            const [result] = await pool.query(
                `select a.Album_Id as AlbumId ,a.Name as AlbumName, Release_Date,Album_Image as AlbumImage from albums a`,
                params
            );
            return result;
        } catch (err) {
            throw err;
        }
    }

    //method to get songs based on album id or name
    static async getSongs(whereQuery, params) {
        try {
            const [result] = await pool.query(
                `SELECT  ar.Name, ar.Genre, a.Name as 'Album Name',t.Name as 'Track Name', Duration, Language, Path, Album_Image as AlbumImage FROM tracks t JOIN albums a on a.Album_ID = t.Album_ID JOIN artists ar on ar.Artist_ID = a.Artist_ID ${whereQuery} `,
                params
            );
            return result;
        } catch (err) {
            throw err;
        }
    }

    //method to get songs based on album id or name
    static async getArtistSongs(artistId) {
        try {
            const [result] = await pool.query(
                `SELECT sa.Album_ID,sar.Artist_ID,st.Track_ID, sa.Name as AlbumName, Release_Date, Language, Album_Image, st.Name as TrackName, Duration, path,
                 sar.Name as ArtistName, Genre FROM spotify.albums sa JOIN tracks st on st.Album_ID = sa.Album_ID JOIN artists sar on 
                 sar.Artist_ID = sa.Artist_ID where sa.Artist_ID = ?`,
                artistId
            );
            return result;
        } catch (err) {
            throw err;
        }
    }

    //method to delete user
    static async deleteUser(emailId, password) {
        try {
            const [result] = await pool.query(
                `DELETE FROM TABLE users WHERE emailId=? and password = ?`,
                [emailId, password]
            );
            return result;
        } catch (err) {
            throw err;
        }
    }

    //method to update user
    static async updateUser(emailId, password) {
        try {
            const [result] = await pool.query(
                `UPDATE users SET ${setCondition} WHERE User_Id=? `,
                [emailId, password]
            );
            return result;
        } catch (err) {
            throw err;
        }
    }

    static async isLiked(userId, trackId) {
        try {
            const [result] = await pool.query(`SELECT * FROM liked_tracks WHERE User_ID = ? AND Track_ID = ?`, [userId, trackId])
            return result

        } catch (err) {
            throw err;
        }
    }

    static async unLike(userId, trackId) {
        try {
            const [result] = await pool.query(`DELETE FROM liked_tracks WHERE User_ID = ? AND Track_ID = ?`, [userId, trackId])
            return result

        } catch (err) {
            throw err;
        }
    }

    static async like(userId, trackId) {
        try {
            const [result] = await pool.query(`INSERT INTO liked_tracks (User_ID, Track_ID) VALUES (?, ?)`, [userId, trackId])
            return result

        } catch (err) {
            throw err;
        }
    }

    static async isTrackExsists(trackId) {
        try {
            const [result] = await pool.query(`SELECT count(*) as count FROM tracks WHERE Track_ID = ?`, [trackId])
            if (result[0].count > 0) {
                return true
            }
            else {
                return false
            }

        } catch (err) {
            throw err;
        }
    }

    static async fetchLikedSongs(userId) {
        try {
            const [result] = await pool.query(`SELECT t.Track_ID AS trackId,a.Album_ID AS albumId,a.Name AS albumName, duration, path, t.Name AS trackName 
                FROM 
                    spotify.liked_tracks lt 
                JOIN 
                    tracks t 
                ON 
                    t.Track_ID = lt.Track_ID 
                JOIN 
                    albums a 
                ON 
                    a.Album_ID = t.Album_ID 
                JOIN 
                    artists ar 
                ON 
                    ar.Artist_ID = a.Artist_ID 
                WHERE
                    User_ID = ?`, [userId])
            return result

        } catch (err) {
            throw err;
        }
    }
}

export default Users;
