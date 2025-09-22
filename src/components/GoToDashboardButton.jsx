// src/components/GoToDashboardButton.jsx
import { useNavigate } from "react-router-dom";

export default function GoToDashboardButton() {
  const navigate = useNavigate();

  function handleClick() {
    sessionStorage.setItem("allowNavigation", "true"); // mark as valid
    navigate("/dashboard");
  }

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg"
    >
      Go to Dashboard
    </button>
  );
}
