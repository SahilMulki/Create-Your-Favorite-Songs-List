import './App.css'
import Header from "./components/Header.jsx"
import ListCustomizer from "./components/ListCustomizer.jsx"
import MainContent from "./components/MainContent.jsx"
import React from "react"


/*
  Here is an explanation of all the components in this website.
  This is the main jsx file to which the three main components for the website are rendered: Header, ListCustomizer, and MainContent. The header is the title and button to connect to spotify. The ListCustomizer includes things that can allow to user to customize their list like by giving it a title or imposing custom rules. The MainContent component is where a large portion of the website resides. In this component there is a search bar where users can search for songs to add to their list. Once a user selects a song that will be added to a list of songs which are made of a child component, SongEntry. Each SongEntry has basic info about a particular song, for example its title, artist, album, ect. Additionally, each song has an audio snippet which is primarily done through the DeezerPreview component.

  Below there are some state variables which are set up here so they can be passed down to either the ListCustomizer of MainContent components. These variables include the actual list of songs that the user has selected, custom rules that the user has imposed, and the title that the user has chosen to give their list.
*/


export default function App() {
  const [songList, setSongList] = React.useState([])
  const [maxSongsPerArtist, setMaxSongsPerArtist] = React.useState("")
  const [maxSongsPerAlbum, setMaxSongsPerAlbum] = React.useState("")
  const [listTitle, setListTitle] = React.useState("")

  return (
    <>
      <div className='bg-gray-800 border-black rounded-4xl'>
        <Header />
        <hr className='mt-5 mx-5'></hr>
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
      </div>
      <MainContent 
        songList={songList} 
        setSongList={setSongList}
        maxSongsPerArtist={maxSongsPerArtist} 
        maxSongsPerAlbum={maxSongsPerAlbum}
        listTitle={listTitle}/>
    </>
  )
}
