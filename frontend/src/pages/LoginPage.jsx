import { useState } from "react";
import { Link } from "react-router-dom";
import { Lock, User } from "lucide-react";
import AuthLayout from "../components/AuthLayout";

export default function LoginPage() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // TODO: ganti dengan endpoint login asli backend kamu
    // await fetch("/api/auth/login", { method: "POST", ... })
    console.log("LOGIN PAYLOAD:", form);
    alert("Login API belum dihubungkan.");
  };

  return (
    <AuthLayout>
      <h2>Welcome Back</h2>
      <p className="subtitle">Sign in to continue to your dashboard</p>

      <form onSubmit={onSubmit} className="auth-form">
        <label>Username</label>
        <div className="input-icon">
          <User size={18} />
          <input
            name="username"
            type="text"
            placeholder="Enter your username"
            value={form.username}
            onChange={onChange}
            required
          />
        </div>

        <label>Password</label>
        <div className="input-icon">
          <Lock size={18} />
          <input
            name="password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={onChange}
            required
          />
        </div>

        <div className="row-between">
          <label className="checkbox">
            <input
              type="checkbox"
              name="rememberMe"
              checked={form.rememberMe}
              onChange={onChange}
            />
            <span>Remember me</span>
          </label>

          <Link to="/forgot-password" className="link-main">
            Forgot Password?
          </Link>
        </div>

        <button type="submit" className="btn-primary">Login</button>
      </form>

      <p className="support-text">
        Having issues logging in? <a href="#">Contact Support</a>
      </p>
    </AuthLayout>
  );
}