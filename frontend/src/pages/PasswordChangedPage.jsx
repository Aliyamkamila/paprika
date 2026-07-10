import { Link } from "react-router-dom";
import { CircleCheckBig } from "lucide-react";
import AuthLayout from "../components/AuthLayout";

export default function PasswordChangedPage() {
  return (
    <AuthLayout>
      <div className="success-box">
        <div className="success-icon">
          <CircleCheckBig size={28} />
        </div>
        <h2>Password Changed!</h2>
        <p className="subtitle center">
          Your password has been successfully updated.
          You can now log in with your new PIN.
        </p>

        <Link to="/login" className="btn-primary btn-link">
          Back to Login
        </Link>
      </div>

      <p className="support-text">
        Having issues logging in? <a href="#">Contact Support</a>
      </p>
    </AuthLayout>
  );
}