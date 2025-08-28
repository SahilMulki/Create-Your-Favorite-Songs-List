export default function Header(props){

  /*
    This component displays the title of the page as well as the button that the user can click to connect with spotify.
  */

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3333";

  function handleLogin() {
    // Redirect the user to the backend's login endpoint to begin the Spotify flow
    // Replace with your current ngrok URL
    window.location.href = `${BACKEND_URL}/login`;
  }

   return (
    <div className="relative h-24 flex items-center mt-5 bg-gray-800 border-black rounded-4xl ">
      <div className="w-full flex flex-col items-center">
        <h1 className="text-6xl font-bold text-center mt-3 tracking-wide">
          Create a List of Your Favorite Songs
        </h1>
        <p className="text-center text-2xl">
          Connect with Spotify to search for songs
        </p>
      </div>

      <div className="absolute text-4xl right-6 top-1/2 -translate-y-1/2">
        <button
          onClick={handleLogin}
          className="bg-green-500 text-white cursor-pointer font-bold py-2 px-5 rounded-full shadow-lg hover:bg-green-600 transition duration-300 ease-in-out"
        >
          Connect to Spotify
        </button>
      </div>
    </div>
  );
}