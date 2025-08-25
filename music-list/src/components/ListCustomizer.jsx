import React from "react"

export default function ListCustomizer(
  {songList, setSongList, maxSongsPerArtist, maxSongsPerAlbum, setMaxSongsPerArtist, setMaxSongsPerAlbum}){
  /*
    There's not much here yet, but this is where the logic adding the rules / constraints (ex. one song per album) will go. For now it's just an input where you can name your list, and a placeholder h1 for the Rules.
  */
  const [customizerIsShown, setCustomizerIsShown] = React.useState(false)

  const [maxSongsPerArtistEnabled, setMaxSongsPerArtistEnabled] = React.useState(false);
  //const [maxSongsPerArtist, setMaxSongsPerArtist] = React.useState("");

  const [maxSongsPerAlbumEnabled, setMaxSongsPerAlbumEnabled] = React.useState(false);
  //const [maxSongsPerAlbum, setMaxSongsPerAlbum] = React.useState("");


  function clearSongList(){
    setSongList([])
  }

  function showCustomizer(){
    setCustomizerIsShown(!customizerIsShown)
  }

  return (
    <div className="flex flex-col items-center mx-2 h-20 my-4 rounded-2xl">
      <div className="flex w-full bg-cyan-300 justify-between mx-2">
        <button 
          className="text-3xl border-2 p-3 rounded-3xl"
          onClick={clearSongList}
        >
            Clear List
        </button>
        <input className="text-2xl border-2 rounded-2xl p-2" type="text" placeholder="My List"/>
        <button className="text-2xl border-2 p-3 rounded-3xl" onClick={showCustomizer}>
          Custom Rules  
        </button>
      </div>
      {customizerIsShown ?
      <div className="absolute mt-20 w-full bg-white border rounded-lg shadow-lg p-4 z-20">
          <label className="flex items-center mb-3">
            <input
              type="checkbox"
              checked={maxSongsPerArtistEnabled}
              onChange={(e) => 
                {
                  setMaxSongsPerArtistEnabled(e.target.checked)
                  if(!e.target.checked)
                    setMaxSongsPerArtist("")
                }}
              className="mr-2"
            />
            <span
              className={`flex items-center justify-center gap-2 ${
                maxSongsPerArtistEnabled ? "text-black" : "text-gray-400"
              }`}
            >
              Max songs per artist:
              <input
                type="number"
                min="1"
                disabled={!maxSongsPerArtistEnabled}
                value={maxSongsPerArtist}
                onChange={(e) => setMaxSongsPerArtist(e.target.value)}
                className="w-16 border rounded px-1"
              />
            </span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={maxSongsPerAlbumEnabled}
              onChange={(e) => {
                setMaxSongsPerAlbumEnabled(e.target.checked)
                if(!e.target.checked)
                  setMaxSongsPerAlbum("")
              }}
              className="mr-2"
            />
            <span
              className={`flex items-center gap-2 ${
                maxSongsPerAlbumEnabled ? "text-black" : "text-gray-400"
              }`}
            >
              Max songs per album:
              <input
                type="number"
                min="1"
                disabled={!maxSongsPerAlbumEnabled}
                value={maxSongsPerAlbum}
                onChange={(e) => setMaxSongsPerAlbum(e.target.value)}
                className="w-16 border rounded px-1"
              />
            </span>
          </label>
        </div>  : undefined}
    </div>
  )
}