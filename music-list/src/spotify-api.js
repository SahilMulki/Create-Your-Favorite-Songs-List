export const getAppToken = async () => {
  const res = await fetch("http://localhost:3001/api/spotify-token");
  const data = await res.json();
  return data.access_token;
};
