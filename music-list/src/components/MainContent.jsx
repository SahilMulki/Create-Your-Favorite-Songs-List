import SongEntry from "./SongEntry.jsx"
import React from "react"


/*
  In this component I handle the process of giving the user to ability to search for songs and add them to the list, by clicking on them. I also render the list of songs that have already been chosen. I also do the actual API call to spotify here, once the authentication token has been retrieved by the backend.
*/

export default function MainContent( {songList, setSongList, maxSongsPerArtist, maxSongsPerAlbum, listTitle} ){
  //Query is what the user types in the search bar. results is the list of songs returned by the search. Token is the authentication token from spotify. isLoggedIntoSpotify is state I used to help with some conditional rendering when user is/isn't logged into Spotify yet. songList is the list of objects of the songs selected by the user. I call .map() on songList to create an array of SongEntry components, which is what ends up being rendered to the page as the list of selected songs.
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState([]);
  const [token, setToken] = React.useState(null);
  const [isLoggedIntoSpotify, setIsLoggedIntoSpotify] = React.useState(false)
  const [warning, setWarning] = React.useState(null)
  const [alertType, setAlertType] = React.useState("error")
  const [recommendations, setRecommendations] = React.useState([])

  //I'm going to use a ref here so that when search bar is empty or there are no results, there is no dropdown of songs being displayed.
  const searchBar = React.useRef(null)


  //Get the token from the url. Then set the state of setToken.
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

  // This is the api call. Note that the authentication token is needed to make this call for this specific authentication code flow from Spotify. The result of the call is unpacked into a list of songs which is started in the state variable results. Every time the user updates the query in the search bar this api call happens.
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
  


  
  function handleChange(event){
    setQuery(event.target.value)
  }

  function checkSongListRules(track){
    let isRuleViolated = false
    const artistRule = parseInt(maxSongsPerArtist, 10)
    const albumRule = parseInt(maxSongsPerAlbum, 10)

    if(!isNaN(artistRule)){
      let songsByArtist = 0
      const artist = track.artists[0].name
      for(let song of songList){
        if(song.track.artists[0].name === artist)
          songsByArtist++
      }

      if(songsByArtist >= artistRule)
        isRuleViolated = true
    }
    if(!isNaN(albumRule)){
      let songsInAlbum = 0
      const album = track.album.name
      for(let song of songList){
        if(song.track.album.name=== album)
          songsInAlbum++
      }

      if(songsInAlbum >= albumRule)
        isRuleViolated = true
    }

    return isRuleViolated
  }

  //This function deals with when the user has clicked on one of the songs resulting from the search. The code makes sure that the song is not a duplicate. I don't believe we can have duplicate songs because there would be issues with the key attribute, which I could get around, but this is better anyways. If the song is not a dupe, then add an object to the end songList. This object just contains the track object. The track objects contains a bunch of information about the song.
  function handleSongSelection(track){

    let isRuleViolated = checkSongListRules(track)
    if(isRuleViolated){
      setWarning("This song breaks one of your rules.")
      setAlertType("error");
      setQuery("")
      return
    }

    let duplicateSong = false
    for(let song of songList){
      if(track.id === song.track.id)
        duplicateSong = true
    }

    if(duplicateSong){
      setWarning("That song is already in your list.")
      setAlertType("error");
      setQuery("")
      return
    }

    setSongList([...songList,
      {
        track: track,
        notes: ""
      }
    ])
  }

  //Once the user selects a song, clear the search bar.
  React.useEffect(() => {
    if(searchBar !== null){
      searchBar.current.value=""
      setQuery("")
    }
  }, [songList])


  //Clear warning after some 3 sec
  React.useEffect(() => {
    if (warning) {
      const timer = setTimeout(() => setWarning(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [warning]);
  
    //Using .map() on the songList to create an array of SongEntry components. The props passed down are: key (required), track (the song objects), index (the index of the element in the list), the setSongs function (I tried to use this for reordering purposes), and the songList itself
  const songComponents = songList.map((song, index) => {
    return <SongEntry 
              key={song.track.id} 
              track={song.track} 
              index={index} 
              list={songList} 
              setList={setSongList}
              id={song.track.id}
              />
  })


  async function createSpotifyPlaylist() {
    if (!listTitle || songList.length === 0) {
      setWarning("Please add a title and at least one song before creating a playlist.");
      setAlertType("error");
      return;
    }

    try {
      // Step 1: get user profile
      const profileRes = await fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const profileData = await profileRes.json();
      const userId = profileData.id;

      // Step 2: create playlist
      const createRes = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: listTitle,
          description: "Created with Create Your Top 100 Songs List 🎶",
          public: true,
        }),
      });
      const playlistData = await createRes.json();

      // Step 3: add songs
      const uris = songList.map((song) => song.track.uri);
      await fetch(`https://api.spotify.com/v1/playlists/${playlistData.id}/tracks`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uris }),
      });

      setWarning(`Playlist "${listTitle}" created successfully! 🎉`);
      setAlertType("success");
    } catch (error) {
      console.error("Error creating playlist:", error);
      setWarning("Something went wrong while creating the playlist.");
      setAlertType("error");
    }
  }

  async function fetchRecommendations() {
    if (!token || songList.length === 0) return;

    const trackIds = songList.map((s) => s.track.id);

    try {
      const res = await fetch("http://localhost:3333/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackIds, accessToken: token }),
      });

      const recs = await res.json();
      console.log("Recommendations:", recs);

      // TODO: set state and render them
      setRecommendations(recs); // maybe store separately
    } catch (err) {
      console.error("Error getting recs:", err);
    }
  }



      /*
        The actual html here is pretty simple. The first div is the search bar. The ref is used to clear the bar. Below that is the html for the dropdown of song options when the user starts typing in the search bar. It will only display the song name and artist. And below that is the list of selected songs.
      */
  return(
    <>
      {warning && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 w-full max-w-md z-50">
          <div className={`px-4 py-3 rounded-lg shadow-md border ${
                            alertType === "success"
                              ? "bg-green-100 border-green-400 text-green-700"
                              : "bg-red-100 border-red-400 text-red-700"
                          }`}>
            {warning}
          </div>
        </div>
      )}

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
        <button
          onClick={fetchRecommendations}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 mt-4"
          >
          Get Song Recommendations
        </button>
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

      <div className="flex flex-col items-center w-full max-w-8xl mx-auto space-y-4 px-4 ">
        {songComponents}
      </div> 

      {recommendations.length > 0 && (
        <div className="w-full mt-6">
          <h2 className="text-2xl font-bold mb-2">Recommended Songs</h2>
          <ul>
            {recommendations.map((track) => (
              <li key={track.id} className="p-2 border-b">
                <strong>{track.name}</strong> by {track.artists[0].name}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-center my-6">
        <button
          onClick={createSpotifyPlaylist}
          className="bg-blue-500 text-white font-bold py-3 px-6 rounded-full shadow-md hover:bg-blue-600 transition"
        >
          Create Playlist on Spotify
        </button>
      </div>
    </>
  )
}