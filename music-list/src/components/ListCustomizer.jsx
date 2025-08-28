import React from "react"

/*
  This component allows the user to customize their list by adding a title and adding custom rules. In this component there is also a clear list button. This component takes some props from App.jsx.
 */

export default function ListCustomizer(
  {songList, setSongList, maxSongsPerArtist, maxSongsPerAlbum, setMaxSongsPerArtist, setMaxSongsPerAlbum, listTitle, setListTitle}){

  //Setting state for variables that allow the user to see the rules customizer.
  const [customizerIsShown, setCustomizerIsShown] = React.useState(false)
  const [maxSongsPerArtistEnabled, setMaxSongsPerArtistEnabled] = React.useState(false);
  const [maxSongsPerAlbumEnabled, setMaxSongsPerAlbumEnabled] = React.useState(false);


  function clearSongList() {
    setSongList([])
  }

  function showCustomizer() {
    setCustomizerIsShown(!customizerIsShown)
  }

  return (
    <div className="flex items-center p-3 h-20 my-5 bg-gray-800 border-black rounded-4xl">
      <div className="flex w-full justify-between mx-2">
        <button 
          className="bg-gray-800 text-3xl border-2 p-3 rounded-3xl hover:bg-gray-600 transition duration-300 ease-in-out cursor-pointer"
          onClick={clearSongList}
        >
            Clear List
        </button>
        <input
          className="text-4xl border-2 rounded-2xl p-2 text-center"
          type="text"
          placeholder="My List"
          value={listTitle}
          onChange={(e) => setListTitle(e.target.value)}
        />
        <button 
          className="bg-gray-800 text-2xl border-2 p-3 cursor-pointer rounded-3xl hover:bg-gray-600 transition duration-300 ease-in-out" 
          onClick={showCustomizer}>
          Custom Rules  
        </button>
      </div>
      {customizerIsShown ?
      <div className="absolute mt-50 text-3xl w-full bg-white border rounded-lg shadow-lg p-4 z-20">
          <label className="flex items-center mb-3">
            <input
              type="checkbox"
              checked={maxSongsPerArtistEnabled}
              onChange={(e) => 
                {
                  setMaxSongsPerArtistEnabled(e.target.checked)
                  if (!e.target.checked)
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