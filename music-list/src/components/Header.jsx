export default function Header(props){

  function handleLogin() {
    // Redirect the user to the backend's login endpoint to begin the Spotify flow
    // Replace with your current ngrok URL
    window.location.href = "https://050b6b8f62a1.ngrok-free.app/login";
  }

  return (
    <>
      <div className="flex items-center justify-center w-full h-20 bg-amber-300">
        <h1 className="text-4xl font-sans font-bold">Create Your Top 100 Songs List</h1>
      </div>
      <div className="flex justify-center items-center h-full">
            <button
              onClick={handleLogin}
              className="bg-green-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-green-600 transition duration-300 ease-in-out"
            >
              Login to Spotify
            </button>
      </div>
    </>
    
  )
}