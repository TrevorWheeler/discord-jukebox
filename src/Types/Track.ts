export default interface Track {
    name: string;
    album: string;
    artists: SpotifyApi.ArtistObjectSimplified[];
    youtubeTitle?: string;
}


