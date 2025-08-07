import DeezerPreview from "./DeezerPreview"
import React from "react"

export default function SongEntry(props){
  const [switched, setSwitched] = React.useState(false)
  const [songIndex, setSongIndex] = React.useState(props.index)
  const [oldIndex, setOldIndex] = React.useState(null)
  const songListIndex = React.useRef(null)

  /*
  React.useEffect(() => {
    setSongIndex(props.index)
    setSwitched(false)
  }, [switched])
  */


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