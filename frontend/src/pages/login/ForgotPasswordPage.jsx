import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import AuthLayout from "../../components/AuthLayout";

export default function ForgotPasswordPage() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    // TODO: endpoint backend (request reset code)
    // await fetch("/api/auth/forgot-password", { method: "POST", ... })
    console.log("FORGOT PASSWORD USERNAME:", username);

    // kirim ke reset-pin sambil bawa username default
    navigate("/reset-pin", { state: { username } });
  };

  return (
    <AuthLayout>
      <h2>Forgot Password</h2>
      <p className="subtitle">
        Enter your username to receive a reset code via email.
      </p>

      <form onSubmit={onSubmit} className="auth-form">
        <label>Username</label>
        <div className="input-icon">
          <User size={18} />
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn-primary">
          Request New Password
        </button>

        <Link to="/login" className="back-link">Back to Login</Link>
      </form>

      <p className="support-text">
        Having issues logging in? <a href="#">Contact Support</a>
      </p>
    </AuthLayout>
  );
}