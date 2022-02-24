const Database = require("../db/index");
var Queue = require("../db/schema/PlayQueue");
export default async (playList: any[], isYoutubeLink: String | false) => {
  await Database.connect();

  if (!isYoutubeLink) {
    for (const music of playList) {
      console.log("looping tracks");
      const track = music.track;
      const album = track.album.name;
      let artists = "";
      for (const artist of track.artists) {
        artists += artist.name + " ";
      }
      const searchQuery = album + " " + artists + track.name;
      const song = {
        searchQuery: searchQuery,
      };

      const doc = new Queue(song);
      await doc.save().catch((err: any) => {
        console.log(err);
      });
    }
  } else {
    const song = {
      searchQuery: isYoutubeLink,
    };
    const doc = new Queue(song);
    await doc.save().catch((err: any) => {
      console.log(err);
    });
  }
};

// {
//   album_type: 'single',
//   artists: [
//     {
//       external_urls: [Object],
//       href: 'https://api.spotify.com/v1/artists/1Zz6NBe8UIZjm88TvehFtx',
//       id: '1Zz6NBe8UIZjm88TvehFtx',
//       name: 'Le Youth',
//       type: 'artist',
//       uri: 'spotify:artist:1Zz6NBe8UIZjm88TvehFtx'
//     }
//   ],
//   available_markets: [
//     'AD', 'AE', 'AG', 'AL', 'AM', 'AO', 'AR', 'AT', 'AU', 'AZ',
//     'BA', 'BB', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BN',
//     'BO', 'BR', 'BS', 'BT', 'BW', 'BY', 'BZ', 'CA', 'CD', 'CG',
//     'CH', 'CI', 'CL', 'CM', 'CO', 'CR', 'CV', 'CW', 'CY', 'CZ',
//     'DE', 'DJ', 'DK', 'DM', 'DO', 'DZ', 'EC', 'EE', 'EG', 'ES',
//     'FI', 'FJ', 'FM', 'FR', 'GA', 'GB', 'GD', 'GE', 'GH', 'GM',
//     'GN', 'GQ', 'GR', 'GT', 'GW', 'GY', 'HK', 'HN', 'HR', 'HT',
//     'HU', 'ID', 'IE', 'IL', 'IN', 'IQ', 'IS', 'IT', 'JM', 'JO',
//     'JP', 'KE', 'KG', 'KH', 'KI', 'KM', 'KN', 'KR', 'KW', 'KZ',
//     'LA', 'LB', 'LC', 'LI', 'LK', 'LR', 'LS', 'LT', 'LU', 'LV',
//     ... 84 more items
//   ],
//   external_urls: { spotify: 'https://open.spotify.com/album/6z8WhxG1JnXfAWmCoVIKBA' },
//   href: 'https://api.spotify.com/v1/albums/6z8WhxG1JnXfAWmCoVIKBA',
//   id: '6z8WhxG1JnXfAWmCoVIKBA',
//   images: [
//     {
//       height: 640,
//       url: 'https://i.scdn.co/image/ab67616d0000b273a77f3fd731c75cb4d7c2d7ad',
//       width: 640
//     },
//     {
//       height: 300,
//       url: 'https://i.scdn.co/image/ab67616d00001e02a77f3fd731c75cb4d7c2d7ad',
//       width: 300
//     },
//     {
//       height: 64,
//       url: 'https://i.scdn.co/image/ab67616d00004851a77f3fd731c75cb4d7c2d7ad',
//       width: 64
//     }
//   ],
//   name: 'Colour',
//   release_date: '2021-02-25',
//   release_date_precision: 'day',
//   total_tracks: 3,
//   type: 'album',
//   uri: 'spotify:album:6z8WhxG1JnXfAWmCoVIKBA'
// }
// {
//   external_urls: { spotify: 'https://open.spotify.com/artist/1Zz6NBe8UIZjm88TvehFtx' },
//   href: 'https://api.spotify.com/v1/artists/1Zz6NBe8UIZjm88TvehFtx',
//   id: '1Zz6NBe8UIZjm88TvehFtx',
//   name: 'Le Youth',
//   type: 'artist',
//   uri: 'spotify:artist:1Zz6NBe8UIZjm88TvehFtx'
// }
// Colour
