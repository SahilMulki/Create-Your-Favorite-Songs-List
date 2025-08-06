/*export const getAppToken = async () => {
  const res = await fetch("http://localhost:3333/api/spotify-token");
  const data = await res.json();
  return data.access_token;
};*/
/*
import spotifyPreviewFinder from 'spotify-preview-finder'
dotenv.config({ path: "../../backend/project.env" });

export async function enhancedSearch(songName, songArtist) {
    try {
      // Search with both song name and artist for higher accuracy
      const result = await spotifyPreviewFinder(songName, songArtist, 1);
      
      if (result.success) {
        /*console.log(`Search Query Used: ${result.searchQuery}`);
        result.results.forEach(song => {
          console.log(`\nFound: ${song.name}`);
          console.log(`Album: ${song.albumName}`);
          console.log(`Track ID: ${song.trackId}`);
          console.log('Preview URLs:');
          song.previewUrls.forEach(url => console.log(`- ${url}`));
        });
        console.log(`Success and url: ${result.results.preview_url}`)
      } else {
        console.error('Error:', result.error);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  }
*/
