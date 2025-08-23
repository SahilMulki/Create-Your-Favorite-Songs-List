/*  This component is still a work in progress. Each song component is a song in the list which the user selected. Most of the display here is pretty straight forward. The track object is passed down through props. From this object we can derive things like the song's name, album cover, artist, ect. Below that is code that deals with allowing the user to play a preview of the song. If the track has a preview url (almost none do) then that url is used for the preview. However in most cases the DeezerPreview component will be called, which is just an alternate, more reliable, way to get the song preview.
*/

import DeezerPreview from "./DeezerPreview"
import React from "react"


export default function SongEntry(props){
  const [inputValue, setInputValue] = React.useState(props.index + 1)
  const [oldIndex, setOldIndex] = React.useState(null)


  React.useEffect(() => {
    setInputValue(props.index + 1)
  }, [props.index])
  
  function storeOldIndex(event){
    setOldIndex(event.target.value - 1)
  }
    

  function handleChange(event){
    setInputValue(event.target.value)
  }

  function implementListChanges(event){
    const value = parseInt(inputValue, 10)
    if(!isNaN(value)){
      const newIndex = value - 1
      if(newIndex >= 0 && newIndex < props.list.length){
          props.setList((oldSongList) => {
            let newSongList = [...oldSongList]
            const songToBeMoved = newSongList.splice(oldIndex, 1)
            newSongList.splice(newIndex, 0, songToBeMoved[0])
            return newSongList
          })
      } 
      else{
        setInputValue(props.index + 1)
      }
    }
    else{
      setInputValue(props.index + 1)
    }
  }


  return (
        <div key={props.track.id} className="flex w-full h-30 justify-between items-center mt-2 p-8 border-4 rounded-b-md">
          <div className="flex justify-center items-center">
            <input 
              type="text"
              value={inputValue}
              onChange={handleChange}
              onBlur={implementListChanges}
              onFocus={storeOldIndex}
              className="text-center w-10 h-10 text-bold text-2xl border-2 rounded-2xl mr-10"
            />
            <img src={props.track.album.images[0]?.url} alt="album" width={90} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-center">{props.track.name} by {props.track.artists[0].name}</h1>
            <h1 className="text-1xl font-semibold text-center">{props.track.album.name}</h1>
          </div>
                {props.track.preview_url ? (
                    <audio className="bg-purple-400" controls src={props.track.preview_url} />
                  ) : (
                    <DeezerPreview trackName={props.track.name} artistName={props.track.artists[0].name}/>
                )}
        </div>
  )
}