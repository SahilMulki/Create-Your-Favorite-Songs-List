/*
// server.js
import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: './project.env' });

const app = express();
app.use(cors());
app.use(express.json());

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

app.get("/api/spotify-token", async (req, res) => {
  try {
    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    const data = await tokenResponse.json();

    if (tokenResponse.ok) {
      res.json({ access_token: data.access_token });
    } else {
      res.status(tokenResponse.status).json({ error: data });
    }
  } catch (err) {
    console.error("Error fetching token:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend server running on http://localhost:${PORT}`);
});
*/
/*
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({ path: "./project.env" });

const app = express();
app.use(cors());
app.use(express.json());

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3001/callback";
const PORT = 3001;

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});

console.log("hi")
app.get("/test", (req, res) => {
  res.send("Server is working");
});
console.log("hi2")

// Step 1: Redirect to Spotify login
app.get("/login", (req, res) => {
  console.log("✅ /login route hit");
  const scope = "user-read-private user-read-email playlist-modify-public";
  const authURL = `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&scope=${encodeURIComponent(
    scope
  )}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
  res.redirect(authURL);
});

// Step 2: Handle redirect from Spotify
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

  // Redirect back to frontend with access token (or store securely)
  res.redirect(`http://localhost:5173/?access_token=${data.access_token}`);
});

app.listen(3001, () => {
  console.log("✅ Backend running on http://localhost:3001");
});
*/
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({ path: "./project.env" });

const app = express();
app.use(cors());
app.use(express.json());

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = "https://050b6b8f62a1.ngrok-free.app/callback";
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

// ✅ Only listen ONCE, after all routes are defined
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});

