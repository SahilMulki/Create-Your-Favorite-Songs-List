import SongEntry from "./SongEntry.jsx"
import React from "react"
import { DragDropContext, Droppable, Draggable} from "react-beautiful-dnd"


/*
  In this component I handle the process of giving the user to ability to search for songs and add them to the list, by clicking on them. I also render the list of songs that have already been chosen. I also do the actual API call to spotify here, once the authentication token has been retrieved by the backend.
*/

export default function MainContent(props){
  //Query is what the user types in the search bar. results is the list of songs returned by the search. Token is the authentication token from spotify. isLoggedIntoSpotify is state I used to help with some conditional rendering when user is/isn't logged into Spotify yet. songList is the list of objects of the songs selected by the user. I call .map() on songList to create an array of SongEntry components, which is what ends up being rendered to the page as the list of selected songs.
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState([]);
  const [token, setToken] = React.useState(null);
  const [isLoggedIntoSpotify, setIsLoggedIntoSpotify] = React.useState(false)
  const [songList, setSongList] = React.useState([])

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
  




  //const [songName, setSongName] = React.useState("")

  function handleChange(event){
    setQuery(event.target.value)
  }

  //This function deals with when the user has clicked on one of the songs resulting from the search. The code makes sure that the song is not a duplicate. I don't believe we can have duplicate songs because there would be issues with the key attribute, which I could get around, but this is better anyways. If the song is not a dupe, then add an object to the end songList. This object just contains the track object. The track objects contains a bunch of information about the song.
  function handleSongSelection(track){

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

  //Once the user selects a song, clear the search bar.
  React.useEffect(() => {
    if(searchBar !== null){
      searchBar.current.value=""
      setQuery("")
    }
  }, [songList])



  /*
  function handleDragEnd(result) {
    if (!result.destination) return;
    const items = Array.from(songList);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setSongList(items);
  }*/

  
    //Using .map() on the songList to create an array of SongEntry components. The props passed down are: key (required), track (the song objects), index (the index of the element in the list), the setSongs function (I tried to use this for reordering purposes), and the songList itself
  const songComponents = songList.map((song, index) => {
    return <SongEntry key={song.track.id} track={song.track} index={index + 1} setSongs={setSongList} songs={songList}/>
  })
  
  
  /*
  <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="song-list" isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false}>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex flex-col gap-2"
            >
              {songList.map((song, index) => (
                <Draggable key={song.track.id} draggableId={song.track.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="flex flex-col items-center w-full max-w-4xl mx-auto space-y-4 px-4"
                    >
                      <SongEntry track={song.track} index={index + 1} setSongs={setSongList} songsLength={songList.length}/>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext> */



      /*
        The actual html here is pretty simple. The first div is the search bar. The ref is used to clear the bar. Below that is the html for the dropdown of song options when the user starts typing in the search bar. It will only display the song name and artist. And below that is the list of selected songs.
      */
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

      <div className="flex flex-col items-center w-full max-w-4xl mx-auto space-y-4 px-4">
        {songComponents}
      </div>  

    </>
  )
}