import DeezerPreview from "./DeezerPreview"
import React from "react"
import trashcanImg from "../assets/temp_trashcan.png"

/*  
  Each song component is a song in the list which the user selected. Most of the display here is pretty straight forward. The track object is passed down through props. From this object we can derive things like the song's name, album cover, artist, ect. Below that is code that deals with allowing the user to play a preview of the song. If the track has a preview url then that url is used for the preview. However in most cases the DeezerPreview component will be called, which is just an alternate, more reliable, way to get the song preview.

  There is also logic that deals with changing the order of the list or deleting songs from the list. The list numberings are inputs which the user can change to the position that they want to the song to be at. Once they do so, any songs below that position will be pushed down.
*/


export default function SongEntry(props) {

  //Setting state here to help with list reordering and deleting songs. Specifically to keep track of what the user inputs to be the new position of the song and what the old position of the song is.
  const [inputValue, setInputValue] = React.useState(props.index + 1)
  const [oldIndex, setOldIndex] = React.useState(null)

  //Making sure that the list numbering lines up with what's displayed.
  React.useEffect(() => {
    setInputValue(props.index + 1)
  }, [props.index])
  
  //When the user clicks on the input to change the song's position first store what the old index of the song is in the song list.
  function storeOldIndex(event) {
    setOldIndex(event.target.value - 1)
  }
    
  // This onChange function is for the input that the user can use to reorder to list.
  function handleChange(event) {
    setInputValue(event.target.value)
  }

  // Once the user has typed in the new position that they wish the song to be in and the click off the input (it loses focus) run this logic to actually reorder the list according to what the user wanted. If the position which the user entered was valid then the song will be moved to that position and all the songs below it will be pushed down one.
  function implementListChanges(event) {
    const value = parseInt(inputValue, 10)
    if (!isNaN(value)) {
      const newIndex = value - 1
      if (newIndex >= 0 && newIndex < props.list.length) {
          props.setList((oldSongList) => {
            let newSongList = [...oldSongList]
            const songToBeMoved = newSongList.splice(oldIndex, 1)
            newSongList.splice(newIndex, 0, songToBeMoved[0])
            return newSongList
          })
      } 
      else {
        setInputValue(props.index + 1)
      }
    }
    else {
      setInputValue(props.index + 1)
    }
  }

  // If the user clicks on the trash can icon then the song will be removed from the list.
  function deleteSong() {
    props.setList((oldSongList) => {
      let newSongList = [...oldSongList]
      newSongList.splice(props.index, 1)
      return newSongList
    })
  }

  // Each song component has a text area where they can put any notes they want. This function is an onChange listener for that text area.
  function handleNotesChange(e) {
    const newNotes = e.target.value
    props.setList((prevList) => {
      const updated = [...prevList];
      updated[props.index] = {
        ...updated[props.index],
        notes: newNotes,
      };
      return updated;
    });
  }


  return (
        <div key={props.track.id} className="flex w-full h-40 justify-between items-center mt-2 p-4 border-4 rounded-3xl bg-gray-900">
          <div className="flex justify-center items-center">
            <input 
              type="text"
              value={inputValue}
              onChange={handleChange}
              onBlur={implementListChanges}
              onFocus={storeOldIndex}
              
              className="text-center w-10 h-10 text-bold text-2xl border-2 rounded-2xl mr-10"
            />
            <img src={props.track.album.images[0]?.url} alt="album" width={120} className="border-white border-2"/>
          </div>
          <div className="flex flex-col">
            <h1 className="text-6xl font-bold text-center">{props.track.name} by {props.track.artists[0].name}</h1>
            <h1 className="text-3xl font-semibold text-center">{props.track.album.name}</h1>
          </div>
          <div className="flex items-center justify-center">
            <textarea
            value={props.list[props.index]?.notes || ""}
            onChange={handleNotesChange}
            placeholder="Write your notes about this song..."
            className="w-60 border rounded-md p-2 text-lg mr-5 my-3"
            rows={3}
            />
            {props.track.preview_url ? (
              <audio className="bg-purple-400" controls src={props.track.preview_url} />) :
              (<DeezerPreview trackName={props.track.name} artistName={props.track.artists[0].name}/>)
            }
            <img 
              src={trashcanImg} 
              alt="delete button" 
              onClick={deleteSong} 
              className="w-25 cursor-pointer"/>
          </div>
        </div>
  )
}