
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";


/* This is where the authentication token for spotify is fetched. It also contains a helper function to help support the DeezerPreview component. The client id and client secret comes from the spotify developer dashboard. The redirect uri is set here, the spotify developer dashboard, and in the header.jsx component. The port is specified as the backend runs on localhost:3333. 

*/

dotenv.config({ path: "./project.env" });

const app = express();
//app.use(cors());
app.use(express.json());

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
// 🔧 Spotify will redirect the user back to your frontend
const REDIRECT_URI = `${FRONTEND_URL}/callback`;

app.use(
  cors({
    origin: [FRONTEND_URL, "http://localhost:5173"],
    credentials: true,
  })
);

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
//const REDIRECT_URI = "https://5f2b97d58a8a.ngrok-free.app/callback";
const PORT = process.env.PORT || 3333;

// ✅ Step 1: Redirect to Spotify login
app.get("/login", (req, res) => {
  console.log("✅ /login route hit");
  const scope = "user-read-private user-read-email playlist-modify-public";
  const authURL = `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&scope=${encodeURIComponent(
    scope
  )}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
  // Log the full authorization URL to the console for debugging
  console.log("➡️ Redirecting to Spotify with URL:", authURL);
  res.redirect(authURL);
});

// ✅ Step 2: Handle redirect from Spotify
app.get("/callback", async (req, res) => {
  const code = req.query.code;

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });

  const data = await response.json();
  console.log("🎟️ Tokens received:", data);

  //res.redirect(`http://localhost:5173/?access_token=${data.access_token}`);
  /*
  res.redirect(
  `http://localhost:5173/?access_token=${data.access_token}&refresh_token=${data.refresh_token}`
);*/
  res.redirect(
  `http://localhost:5173/?access_token=${data.access_token}&refresh_token=${data.refresh_token}&expires_in=${data.expires_in}`
);

});


app.get("/deezer-preview", async (req, res) => {
  const { track, artist } = req.query;

  if (!track || !artist) {
    return res.status(400).json({ error: "Missing track or artist" });
  }

  const query = `${track} ${artist}`;
  const deezerUrl = `https://api.deezer.com/search?q=${encodeURIComponent(query)}`;

  try {
    const deezerRes = await fetch(deezerUrl);
    const data = await deezerRes.json();

    if (data && data.data && data.data.length > 0) {
      const previewUrl = data.data[0].preview;
      return res.json({ preview_url: previewUrl });
    } else {
      return res.status(404).json({ error: "No preview found" });
    }
  } catch (err) {
    console.error("❌ Deezer fetch error:", err);
    return res.status(500).json({ error: "Failed to fetch from Deezer" });
  }
});


app.get("/refresh_token", async (req, res) => {
  const refreshToken = req.query.refresh_token;

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  const data = await response.json();
  res.json(data); // contains a new access_token
});

async function refreshAccessToken(refreshToken) {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error("Failed to refresh token: " + JSON.stringify(data));
  }
  return data.access_token;
}


app.get("/test", (req, res) => res.send("Server is working"));

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});







