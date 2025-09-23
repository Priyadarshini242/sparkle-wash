// src/services/api.js
export async function fetchProtected() {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/api/protected", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  return res.json();
}
