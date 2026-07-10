import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, KeyRound, Lock, User, ShieldCheck } from "lucide-react";
import AuthLayout from "../components/AuthLayout";

export default function ResetPinPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const defaultUsername = useMemo(
    () => location.state?.username || "",
    [location.state]
  );

  const [form, setForm] = useState({
    username: defaultUsername,
    resetCode: "",
    newPin: "",
    confirmPin: "",
  });

  const [showPin, setShowPin] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (form.newPin !== form.confirmPin) {
      alert("Confirm PIN tidak sama.");
      return;
    }

    if (form.newPin.length < 4 || form.newPin.length > 6) {
      alert("PIN harus 4-6 digit.");
      return;
    }

    // TODO: endpoint backend (verify reset code + set new PIN)
    // await fetch("/api/auth/reset-pin", { method: "POST", ... })
    console.log("RESET PIN PAYLOAD:", form);

    navigate("/password-changed");
  };

  return (
    <AuthLayout>
      <h2>Reset Your PIN</h2>
      <p className="subtitle">
        Enter the code sent to your email and set your new PIN to regain access
        to your account.
      </p>

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

        <label>Reset Code</label>
        <div className="input-icon">
          <KeyRound size={18} />
          <input
            name="resetCode"
            type="text"
            placeholder="Enter reset code (example: ccvv5)"
            value={form.resetCode}
            onChange={onChange}
            required
          />
        </div>

        <label>New PIN</label>
        <div className="input-icon input-icon-right">
          <Lock size={18} />
          <input
            name="newPin"
            type={showPin ? "text" : "password"}
            placeholder="Enter new 4-6 digit PIN"
            value={form.newPin}
            onChange={onChange}
            required
          />
          <button
            type="button"
            className="icon-btn"
            onClick={() => setShowPin((s) => !s)}
            aria-label="toggle pin visibility"
          >
            {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <label>Confirm New PIN</label>
        <div className="input-icon">
          <ShieldCheck size={18} />
          <input
            name="confirmPin"
            type={showPin ? "text" : "password"}
            placeholder="Confirm your new PIN"
            value={form.confirmPin}
            onChange={onChange}
            required
          />
        </div>

        <button type="submit" className="btn-primary">Change Password</button>
      </form>

      <p className="support-text">
        Having issues logging in? <a href="#">Contact Support</a>
      </p>
    </AuthLayout>
  );
}