import DeezerPreview from "./DeezerPreview"

export default function SongEntry(props){

  function rearrangeList(){

  }

  return (
        <div key={props.track.id} className="flex w-full h-30 justify-between items-center mt-2 p-8 border-4 rounded-b-md">
          <div className="flex justify-center items-center">
            <input
              type="text"
              value={props.index + 1}
              className="text-center w-10 h-10 text-2xl border-2 rounded-2xl mr-10"
              onChange={rearrangeList}
            />
            <img src={props.track.album.images[0]?.url} alt="album" width={90} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">{props.track.name} by {props.track.artists[0].name}</h1>
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