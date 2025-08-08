import DeezerPreview from "./DeezerPreview"
import React from "react"

/*  This component is still a work in progress. Each song component is a song in the list which the user selected. Most of the display here is pretty straight forward. The track object is passed down through props. From this object we can derive things like the song's name, album cover, artist, ect. Below that is code that deals with allowing the user to play a preview of the song. If the track has a preview url (almost none do) then that url is used for the preview. However in most cases the DeezerPreview component will be called, which is just an alternate, more reliable, way to get the song preview.

  The main issue I have been trying to fix is reordering the list. There are many ways to approach this, drag and drop, or simple buttons. Here I've tried to make it so that the list accent (the numberings on the left) are editable and if you want to reorder the list you can just type in the new position you want the song to work on. I've not correctly implemented this as of yet. I suspect that the lack of setOldIndex plays a role but there is probably more than one issue here. Perhaps some of the state declared here actually needs to be declared in the parent component and passed down, so that there is only one source of truth.
*/


export default function SongEntry(props){
  //const [switched, setSwitched] = React.useState(false)
  const [songIndex, setSongIndex] = React.useState(props.index)
  const [oldIndex, setOldIndex] = React.useState(null)
  const songListIndex = React.useRef(null)

  /*
  React.useEffect(() => {
    setSongIndex(props.index)
    setSwitched(false)
  }, [switched])
  */

  /*
  if(songIndex !== props.index){
    setSongIndex(props.index)
  }*/


  function reorder(event){
    const newIndex = event.target.value - 1
    
    if(newIndex !== null && newIndex >= 0 && newIndex <= props.songs.length - 1){
        
        props.setSongs(() => {
          let updatedSongs = [...props.songs]
          const temp = updatedSongs[newIndex];
          updatedSongs[newIndex] = updatedSongs[oldIndex - 1];
          updatedSongs[oldIndex - 1] = temp;  
          //[updatedSongs[newIndex], updatedSongs[oldIndex - 1]] = [updatedSongs[oldIndex - 1], updatedSongs[newIndex]]
          return updatedSongs
        }
        )
    } 
    
  }


  function storeOldIndex(event){
    setOldIndex(event.target.value)
  }
 

  function handleChange(event){
    setSongIndex(event.target.value)
  }

  console.log(`Actual index passed in: ${props.index}`)
  console.log(`${props.track.name} at index: ${songIndex}`)

  return (
        <div key={props.track.id} className="flex w-full h-30 justify-between items-center mt-2 p-8 border-4 rounded-b-md">
          <div className="flex justify-center items-center">
            <input 
              type="text"
              ref={songListIndex}
              //onKeyDown={handleKeyPress}
              value={songIndex}
              onChange={handleChange}
              onBlur={reorder}
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