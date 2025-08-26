
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";


/* This is where the authentication token for spotify is fetched. It also contains a helper function to help support the DeezerPreview component. The client id and client secret comes from the spotify developer dashboard. The redirect uri is set here, the spotify developer dashboard, and in the header.jsx component. The port is specified as the backend runs on localhost:3333. 

*/

dotenv.config({ path: "./project.env" });

const app = express();
app.use(cors());
app.use(express.json());

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = "https://64472ef04fd3.ngrok-free.app/callback";
const PORT = 3333;

// ✅ Test route
app.get("/test", (req, res) => {
  res.send("Server is working");
});

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

  res.redirect(`http://localhost:5173/?access_token=${data.access_token}`);
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


// server.js
app.post("/recommendations", async (req, res) => {
  const { trackIds, accessToken } = req.body;
  console.log("➡️ Using token:", accessToken?.slice(0, 20) + "...");

  if (!trackIds || trackIds.length === 0) {
    return res.status(400).json({ error: "No track IDs provided" });
  }

  try {
    // Split into chunks of 5
    const chunks = [];
    for (let i = 0; i < trackIds.length; i += 5) {
      chunks.push(trackIds.slice(i, i + 5));
    }

    // Track frequencies
    const trackFrequency = new Map();

    for (const chunk of chunks) {
      const query = `https://api.spotify.com/v1/recommendations?seed_tracks=${chunk.join(",")}&limit=10`;
      console.log("➡️ Fetching recs with:", query);

      const response = await fetch(query, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const text = await response.text(); // read raw once
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error("❌ Failed to parse JSON:", text);
        return res.status(500).json({ error: "Invalid JSON from Spotify" });
      }

      console.log("➡️ Headers:", {
        Authorization: `Bearer ${accessToken.slice(0,20)}...`
      });

      if (!response.ok) {
        const text = await response.text(); // read raw body for debugging
        const errorText = await response.text();
        console.error("❌ Spotify API error:", response.status, text);
        return res.status(500).json({ error: `Spotify error ${response.status}: ${text}` });
      }

      const data = await response.json();
      console.log("✅ Spotify response:", data);

      if (data.tracks) {
        data.tracks.forEach((track) => {
          if (!trackFrequency.has(track.id)) {
            trackFrequency.set(track.id, { track, count: 1 });
          } else {
            trackFrequency.get(track.id).count += 1;
          }
        });
      }
    }

    // Convert to array and sort by count, then popularity
    const weightedRecs = Array.from(trackFrequency.values())
      .sort((a, b) => {
        if (b.count === a.count) {
          return (b.track.popularity || 0) - (a.track.popularity || 0);
        }
        return b.count - a.count;
      })
      .slice(0, 20) // ⬅️ Only return top 20
      .map((entry) => entry.track);

    res.json(weightedRecs);
  } catch (err) {
    console.error("Error fetching recommendations:", err);
    res.status(500).json({ error: "Failed to fetch recommendations" });
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



// ✅ Only listen ONCE, after all routes are defined
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});







