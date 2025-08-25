import './App.css'
import Header from "./components/Header.jsx"
import ListCustomizer from "./components/ListCustomizer.jsx"
import MainContent from "./components/MainContent.jsx"
import React from "react"

export default function App() {
  const [songList, setSongList] = React.useState([])
  const [maxSongsPerArtist, setMaxSongsPerArtist] = React.useState("")
  const [maxSongsPerAlbum, setMaxSongsPerAlbum] = React.useState("")
  const [listTitle, setListTitle] = React.useState("")

  return (
    <>
      <Header />
      <ListCustomizer 
        songList={songList} 
        setSongList={setSongList} 
        maxSongsPerArtist={maxSongsPerArtist}
        setMaxSongsPerArtist={setMaxSongsPerArtist} 
        maxSongsPerAlbum={maxSongsPerAlbum}
        setMaxSongsPerAlbum={setMaxSongsPerAlbum}
        listTitle={listTitle}
        setListTitle={setListTitle}
        />
      <MainContent 
        songList={songList} 
        setSongList={setSongList}
        maxSongsPerArtist={maxSongsPerArtist} 
        maxSongsPerAlbum={maxSongsPerAlbum}
        listTitle={listTitle}/>
    </>
  )
}
