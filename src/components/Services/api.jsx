// src/services/api.js
export async function fetchProtected() {
  const token = localStorage.getItem("token");

  const res = await fetch("import.meta.env.VITE_API_URL/protected", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  return res.json();
}
