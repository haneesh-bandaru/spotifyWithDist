import { v1 as uuidv1 } from 'uuid';

export function formatSongsData(songs) {
    const result = [];

    const albumMap = songs.reduce((Album, song) => {
        if (!Album[song["Album Name"]]) {
            Album[song["Album Name"]] = {
                "Album Name": song["Album Name"],
                "Artist Name": song["Name"],
                "Genre": song["Genre"],
                "Language": song["Language"],
                "AlbumImage": song["AlbumImage"],
                "Tracks": []
            };
        }
        Album[song["Album Name"]]["Tracks"].push({
            "TrackName": song["Track Name"],
            "Duration": song["Duration"],
            "Path": song["Path"]
        });
        return result;
    }, {});

    for (const albumName in albumMap) {
        result.push(albumMap[albumName]);
    }

    return result;
}

export function optimizeApiResponse(data) {
    if (!Array.isArray(data)) {
        throw new Error('Invalid data format: expected an array');
    }

    const artistMap = {};

    data.forEach((item) => {
        const {
            Artist_ID,
            ArtistName,
            Genre,
            Album_ID,
            AlbumName,
            Release_Date,
            Language,
            Album_Image,
            Track_ID,
            TrackName,
            Duration,
            path
        } = item;

        if (!artistMap[Artist_ID]) {
            artistMap[Artist_ID] = {
                Artist_ID,
                ArtistName,
                Genre,
                Albums: []
            };
        }

        const artist = artistMap[Artist_ID];

        let album = artist.Albums.find(alb => alb.Album_ID === Album_ID);
        if (!album) {
            album = {
                Album_ID,
                AlbumName,
                Release_Date,
                Language,
                Album_Image,
                Tracks: []
            };
            artist.Albums.push(album);
        }

        album.Tracks.push({
            Track_ID,
            TrackName,
            Duration,
            path
        });
    });

    return { Artists: Object.values(artistMap) };
}

export function trackInsertData(albumId, data) {
    const result = [];

    data.forEach(song => {
        const trackId = uuidv1();
        const duration = parseInt(song.duration, 10);
        const path = `/tracks/${song.songName.toLowerCase().split(" ").join("_")}.mp3`;

        result.push([trackId, albumId, song.songName, duration, path]);
    });

    return result;
}

export function groupTracksByPlaylist(data) {
    const playlistsMap = {};

    data.forEach(item => {
        const { Playlist_ID, Playlist_Name, Status, Track_ID, TrackName, Duration, Path, ImageUrl } = item;

        if (!playlistsMap[Playlist_ID]) {
            playlistsMap[Playlist_ID] = { Playlist_ID, Playlist_Name, Status, ImageUrl, Tracks: [] };
        }

        playlistsMap[Playlist_ID].Tracks.push({ Track_ID, TrackName, Duration, Path });
    });

    return Object.values(playlistsMap);
}
