import SongEntry from "./SongEntry.jsx"
import React from "react"
import {getAppToken} from "../spotify-api.js"

export default function MainContent(props){
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState([]);
  const [token, setToken] = React.useState(null);
  const [isLoggedIntoSpotify, setIsLoggedIntoSpotify] = React.useState(false)


  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("access_token");

    if (accessToken) {
      setToken(accessToken);
      setIsLoggedIntoSpotify(true);
      
      // Clean up the URL by removing the access token parameter
      // This prevents the token from being exposed or bookmarked
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  /*
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("access_token");
    if (accessToken) {
      setToken(accessToken);
    }
  }, [])
  */

  /*
  React.useEffect(() => {
    getAppToken().then(tok => { 
      setToken(tok)
    });
  }, []);
  */

  React.useEffect(() => {
    const delay = setTimeout(() => {
      if (query.length > 1 && token) {
       fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`, {
        headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
          if (data.tracks && data.tracks.items) {
            setResults(data.tracks.items);
          } 
          else {
            console.warn("Invalid search result:", data);
            setResults([]); // Prevent crash
          }
        });
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [query, token]);
  




  //const [songName, setSongName] = React.useState("")

  function handleChange(event){
    setQuery(event.target.value)
  }

  
  results.forEach(track => {
    console.log(`${track.name} preview:`, track.preview_url);
  });



  return(
    <>
      <div className="flex w-full bg-green-400 h-20 items-center justify-center">
        <label className="text-2xl p-2 mx-2"> Song Name:
          <input
            type="text"
            placeholder="ex. Diamonds"
            name="song-name"
            onChange={handleChange}
            value={query}
            className="text-2xl border-2 rounded-2xl p-4"
          />
        </label>
      </div>
      {isLoggedIntoSpotify &&
        <ul>
            {results.map(track => (
              <li key={track.id}>
                <img src={track.album.images[0]?.url} alt="album" width={50} />
                <div>
                  <strong>{track.name}</strong> by {track.artists[0].name}
                  {track.preview_url ? (
                    <audio className="bg-purple-400" controls src={track.preview_url} />
                  ) : undefined}
                </div>
              </li>
            ))}
          </ul>
      }
      <button className="w-full flex items-center justify-center text-2xl bg-gray-400 mt-2">+</button>
    </>
  )
}