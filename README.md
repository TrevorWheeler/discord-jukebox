# Discord Jukebox

Jukebox is a feature-rich Discord bot designed to enhance a server's music experience. It allows users to collaboratively play and manage music from various sources, manage playlists, and enjoy additional fun commands. This is now mostly deprecated due to Spotify introducing "Spotify Sessions".

## Features

- Play music from YouTube, Spotify, and direct searches
- Queue management (add, skip, stop, list)
- Playlist support
- Voice channel integration
- Additional fun commands (jokes, rolls, etc.)

## Commands

### Music Commands

- `-f p <query>`: Play a song or add it to the queue
- `-f show <query>`: Display search results for a query
- `-f skip`: Skip the current track
- `-f stop`: Stop playback and clear the queue
- `-f q`: List the next 10 songs in the queue
- `-f bnc`: Play a shuffled playlist of bangers

### Other Commands

- `/roll`: Generate a random number between 0 and 100
- `/joke`: Tell a random joke
- `/steveslatest`: Get Steve Wallis' latest stealth camping video
- `/help`: Display a list of available commands

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables:
   - `DISCORD_TOKEN`: Your Discord bot token
   - `SPOTIFY_CLIENT_ID`: Spotify API client ID
   - `SPOTIFY_CLIENT_SECRET`: Spotify API client secret
   - `GOOGLE_API_KEY`: YouTube Data API key
   - `DB_USER`: MongoDB username
   - `DB_PASS`: MongoDB password
   - `DB_HOST`: MongoDB host
   - `DB_NAME`: MongoDB database name
   - `CHROME_PATH`: Path to Chrome executable (for Puppeteer)
4. Run the bot: `npm start`

## Technologies Used

- Discord.js
- Node.js
- MongoDB
- Spotify Web API
- YouTube Data API
- Puppeteer
