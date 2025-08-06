import SongEntry from "./SongEntry.jsx"
import React from "react"

export default function MainContent(props){
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState([]);
  const [token, setToken] = React.useState(null);
  const [isLoggedIntoSpotify, setIsLoggedIntoSpotify] = React.useState(false)
  const [songList, setSongList] = React.useState([])

  const searchBar = React.useRef(null)


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

  
  function handleSongSelection(track){
    console.log(track)
    /*
    const songName = track.name
    const songArtist = track.artists[0].name
    console.log(`${songName} by ${songArtist}`)
    */
    let duplicateSong = false
    for(let song of songList){
      if(track.id === song.track.id)
        duplicateSong = true
    }

    if(!duplicateSong){
      setSongList([...songList,
        {
          track: track
        }
      ])
    }
  }

  React.useEffect(() => {
    if(searchBar !== null){
      searchBar.current.value=""
      setQuery("")
    }
  }, [songList])

  /*
    {isLoggedIntoSpotify &&
        <ul>
            {results.map(track => (
              <li key={track.id} onClick={() => handleSongSelection(track)} className="flex w-full h-20 justify-center items-center hover:bg-amber-300 p-4" value={track}>
                <img src={track.album.images[0]?.url} alt="album" width={50} />
                <div>
                  <strong>{track.name}</strong> by {track.artists[0].name}
                  {track.preview_url ? (
                    <audio className="bg-purple-400" controls src={track.preview_url} />
                  ) : (
                    <DeezerPreview trackName={track.name} artistName={track.artists[0].name}/>
                  )}
                </div>
              </li>
            ))}
          </ul>
      }
  */
  const songComponents = songList.map((song, index) => {
    return <SongEntry key={song.track.id} track={song.track} index={index}/>
  })



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
            ref = {searchBar}
          />
        </label>
      </div>
      {isLoggedIntoSpotify && query.length > 1 && results.length > 1 ?
        (<ul className="flex items-center justify-center flex-col bg-purple-600 w-full absolute z-10">
            {results.map(track => (
              <li key={track.id} onClick={() => handleSongSelection(track)} className="flex w-auto h-20 justify-center items-center hover:bg-amber-300 p-4" value={track}>
                <div className="text-3xl p-4">
                  <strong>{track.name}</strong> by {track.artists[0].name}
                </div>
              </li>
            ))}
          </ul>) : undefined
      }
      <div className="flex flex-col">
        {songComponents}
      </div>
    </>
  )
}