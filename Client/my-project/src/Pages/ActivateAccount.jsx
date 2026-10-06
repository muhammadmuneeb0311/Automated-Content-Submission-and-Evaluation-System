import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ActivateAccount() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://automated-content-submission-and-t73b.onrender.com/api/auth/activate", {
        token,
        password,
      });
      setMsg(res.data.msg); // ⚡ use msg from backend
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMsg(err.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Activate your account</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          className="border rounded p-2 w-full mb-3"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Activate
        </button>
      </form>
      {msg && <p className={`mt-3 ${msg.includes("✅") ? "text-green-600" : "text-red-600"}`}>{msg}</p>}
    </div>
  );
}
