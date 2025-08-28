import SongEntry from "./SongEntry.jsx"
import React from "react"

/*
  In this component I handle the process of giving the user to ability to search for songs and add them to the list, by clicking on them. I also render the list of songs that have already been chosen. I also do the actual API call to spotify here, once the authentication token has been retrieved by the backend. There is also some logic to automatically refresh the token when it expires.
*/

export default function MainContent( {songList, setSongList, maxSongsPerArtist, maxSongsPerAlbum, listTitle} ) {
  /*
    Explanation of the state variables below:

    - query is what the user types in the search bar. 
    - results is the list of songs returned by the search. 
    - token is the authentication token from spotify.
    - isLoggedIntoSpotify is state I used to help with some conditional rendering when user is/isn't logged into Spotify yet. 
    - songList is the list of objects of the songs selected by the user. I call .map() on songList to create an array of SongEntry components, which is what ends up being rendered to the page as the list of selected songs.
    - The warning and alertType help communicate errors and successes with the user, specifically as it relates to creating a Spotify playlist from their list.
  */
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState([]);
  const [token, setToken] = React.useState(null);
  const [isLoggedIntoSpotify, setIsLoggedIntoSpotify] = React.useState(false)
  const [warning, setWarning] = React.useState(null)
  const [alertType, setAlertType] = React.useState("error")

  //There is a ref here so that when search bar is empty or there are no results, there is no dropdown of songs being displayed.
  const searchBar = React.useRef(null)

  // This useEffect function gets the accessToken, refreshToken, and when the access token expires from the url once the user has been refirected after connecting with spotify. The refresh token is stored in localStorage. Once that information is stored the url is cleared of the information.
 React.useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");
  const expiresIn = params.get("expires_in");
  

  if (accessToken) {
    setToken(accessToken);
    setIsLoggedIntoSpotify(true);

    if (refreshToken) {
      localStorage.setItem("refresh_token", refreshToken);
    }
    if (expiresIn) {
      const expiryTime = Date.now() + expiresIn * 1000;
      localStorage.setItem("token_expiry", expiryTime);
    }

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
            setResults([]);
          }
        });
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [query, token]);
  


  // This is an onChange function for when the user is typing in the song search bar.
  function handleChange(event) {
    setQuery(event.target.value)
  }

  // This is a helper function which determines if the song passed in violates any of the custom rules that a user may have set up.
  function checkSongListRules(track) {
    let isRuleViolated = false
    const artistRule = parseInt(maxSongsPerArtist, 10)
    const albumRule = parseInt(maxSongsPerAlbum, 10)

    if (!isNaN(artistRule)) {
      let songsByArtist = 0
      const artist = track.artists[0].name
      for (let song of songList) {
        if (song.track.artists[0].name === artist)
          songsByArtist++
      }

      if (songsByArtist >= artistRule)
        isRuleViolated = true
    }
    if (!isNaN(albumRule)) {
      let songsInAlbum = 0
      const album = track.album.name
      for (let song of songList) {
        if(song.track.album.name=== album)
          songsInAlbum++
      }

      if(songsInAlbum >= albumRule)
        isRuleViolated = true
    }
    return isRuleViolated
  }

  //This function deals with when the user has clicked on one of the songs resulting from the search to add to their list. The code makes sure that the song is not a duplicate and it does not violate any custom rules. If everything is good, then an object containing the track information and any notes the user may want to add is appended to the list.
  function handleSongSelection(track) {

    let isRuleViolated = checkSongListRules(track)
    if (isRuleViolated) {
      setWarning("This song breaks one of your rules.")
      setAlertType("error");
      setQuery("")
      return
    }

    let duplicateSong = false
    for (let song of songList) {
      if (track.id === song.track.id)
        duplicateSong = true
    }

    if (duplicateSong) {
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

  //Once the user selects a song, clear the search bar. Uses the ref initialized above to do this.
  React.useEffect(() => {
    if (searchBar !== null) {
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
  
    //Using .map() on the songList to create an array of SongEntry components. Some information about the song is passed down through props.
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


  /*
    This is an onClick function for the create playlist button. This purpose of this function is to take the list the user has created and create a new playlist in their spotify account. This function makes sure that the user has given their list a title and that the list has atleast one song. If there is any issues a warning will be displayed communicating to the user what went wrong. If the playlist is successfully added than a  notification will be temporarily displayed to communicate that. 
   */
  async function createSpotifyPlaylist() {
    if (!listTitle || songList.length === 0) {
      setWarning("Please add a title and at least one song before creating a playlist.");
      setAlertType("error");
      return;
    }

    try {
      // Get user profile
      const profileRes = await fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const profileData = await profileRes.json();
      const userId = profileData.id;

      // Create playlist
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

      // Add songs from their list to the playlist
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

  //Helper function to make sure that when the access token expires a refresh token is ready to replace it.
  async function refreshAccessToken(refreshToken) {
    const res = await fetch(`http://localhost:3333/refresh_token?refresh_token=${refreshToken}`);
    const data = await res.json();
    return data.access_token;
  }

  // Schedule the refresh token to replace the old token
  React.useEffect(() => {
    const refreshToken = localStorage.getItem("refresh_token");
    const expiryTime = localStorage.getItem("token_expiry");

    if (!refreshToken || !expiryTime)
      return;

    const scheduleRefresh = () => {
      const now = Date.now();
      const delay = expiryTime - now - 5 * 60 * 1000; // refresh 5 min early

      if (delay <= 0) {
        (async () => {
          const newToken = await refreshAccessToken(refreshToken);
          if (newToken) {
            setToken(newToken);
            const newExpiry = Date.now() + 3600 * 1000;
            localStorage.setItem("token_expiry", newExpiry);
          }
          scheduleRefresh();
        })();
      } else {
        setTimeout(async () => {
          const newToken = await refreshAccessToken(refreshToken);
          if (newToken) {
            setToken(newToken);
            const newExpiry = Date.now() + 3600 * 1000;
            localStorage.setItem("token_expiry", newExpiry);
          }
          scheduleRefresh();
        }, delay);
      }
    };

    scheduleRefresh();
  }, []);

  return(
    <div className="bg-gray-800 border-black rounded-4xl p-10">
      {warning && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 w-full max-w-md z-50">
          <div className={`px-4 py-3 rounded-lg text-center text-2xl shadow-md border ${
                            alertType === "success"
                              ? "bg-green-100 border-green-400 text-green-700"
                              : "bg-red-100 border-red-400 text-red-700"
                          }`}>
            {warning}
          </div>
        </div>
      )}

      <div className="flex w-full h-20 items-center justify-center mb-5 tracking-widest">
        <label className="text-4xl p-2"> Enter Song Name: 
          <input
            type="text"
            name="song-name"
            onChange={handleChange}
            value={query}
            className="text-2xl border-2 rounded-2xl ml-5 p-4 text-center"
            ref = {searchBar}
            autoComplete="off"
          />
        </label>
      </div>

      {isLoggedIntoSpotify && query.length > 1 && results.length > 1 ?
        (<ul className="flex items-center justify-center flex-col bg-gray-600 w-full absolute z-10">
            {results.map(track => (
              <li key={track.id} onClick={() => handleSongSelection(track)} className="flex w-auto h-20 justify-center items-center hover:bg-gray-400 p-4" value={track}>
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

      <div className="flex justify-center mt-15">
        <button
          onClick={createSpotifyPlaylist}
          className="bg-blue-500 text-white cursor-pointer text-4xl font-bold py-3 px-6 rounded-full shadow-md hover:bg-blue-600 transition"
        >
          Create Playlist on Spotify
        </button>
      </div>
    </div>
  )
}