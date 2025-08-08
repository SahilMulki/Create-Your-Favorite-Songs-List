import React from "react";

export default function DeezerPreview({ trackName, artistName }) {
  /*
    This component is what provides the music preview to the selected songs. There is an API call which provies the song name and artist to the Deezer API. It returns an audio element with the correct (hopefully) preview url.
  */


  const [previewUrl, setPreviewUrl] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    async function fetchPreview() {
      try {
        const response = await fetch(
          `http://localhost:3333/deezer-preview?track=${encodeURIComponent(trackName)}&artist=${encodeURIComponent(artistName)}`
        );
        const data = await response.json();

        if (response.ok && data.preview_url) {
          setPreviewUrl(data.preview_url);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("❌ Failed to fetch Deezer preview:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchPreview();
  }, [trackName, artistName]);

  if (loading) return <p className="text-sm italic">Loading preview...</p>;
  if (error || !previewUrl) return <p className="text-sm italic">No preview available</p>;

  return <audio controls src={previewUrl} />;
}
