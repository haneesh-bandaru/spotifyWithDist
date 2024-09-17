import { poolPromise } from "../utils/dbConnection.js";
import { v1 as uuidv1 } from 'uuid';
import { trackInsertData } from "../utils/functions.js";


const pool = await poolPromise

class Artists {

    static async findUserType(userId) {
        try {
            const [result] = await pool.query("SELECT count(*) AS count, User_Type as type FROM users WHERE user_ID = ?", [userId])

            if (result[0].count != 1) {
                return false
            }
            else {
                return result
            }
        } catch (error) {
            throw error
        }
    }

    static async isAlbumExists(AlbumId) {
        try {
            const [result] = await pool.query("SELECT count(*) AS count FROM albums WHERE album_ID = ?", [AlbumId])
            if (result[0].count != 1) {
                return false
            }
            else {
                return true
            }
        } catch (error) {
            throw error
        }
    }

    static async isArtist(artistId) {
        try {
            const [result] = await pool.query("SELECT count(*) AS count FROM artists WHERE Artist_ID = ?", [artistId])
            if (result[0].count != 1) {
                return false
            }
            else {
                return true
            }
        } catch (error) {
            throw error
        }
    }

    static async isAuthorised(artistId, albumId) {
        try {
            const [result] = await pool.query("SELECT count(*) AS count FROM albums WHERE Artist_ID = ? and Album_ID = ?", [artistId, albumId])

            if (result[0].count != 1) {
                return false
            }
            else {
                return true
            }
        } catch (error) {
            throw error
        }
    }

    static async isTrackExists(trackId) {
        try {
            const [result] = await pool.query("SELECT count(*) AS count FROM tracks WHERE track_Id = ?", [trackId])
            if (result[0].count != 1) {
                return false
            }
            else {
                return true
            }
        } catch (error) {
            throw error
        }
    }

    static async createAlbum(artistId, track, albumName, releaseDate, language) {
        const albumId = uuidv1();
        try {
            const [result] = await pool.query("INSERT INTO albums (Album_ID,Artist_ID,Name,Release_Date,Language) VALUES (?,?,?,?,?)", [albumId, artistId, albumName, releaseDate, language])
            if (track.length != 0) {
                await this.addTrack(albumId, track)
            }
            return result
        }
        catch (error) {
            throw error
        }
    }

    static async addTrack(albumId, track) {
        const values = trackInsertData(albumId, track)
        try {
            const [results] = await pool.query('INSERT INTO tracks (Track_ID,Album_ID,Name,Duration,Path) VALUES ?', [values])
            return results
        } catch (error) {
            throw error
        }
    }

    static async deleteTrack(trackId) {
        try {
            const [results] = await pool.query('DELETE FROM tracks where TrackId = ?', [trackId])
            return results
        } catch (error) {
            throw error
        }
    }

    static async deleteAlbum(albumId) {
        try {
            let result;
            [result] = await pool.query(`DELETE FROM tracks WHERE Album_ID = ?`, [albumId]);
            [result] = await pool.query(`DELETE FROM Albums WHERE Album_ID = ?`, [albumId]);
            return result
        } catch (error) {
            throw error
        }
    }

}

export default Artists