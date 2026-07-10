import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPinPage from "./pages/ResetPinPage";
import PasswordChangedPage from "./pages/PasswordChangedPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-pin" element={<ResetPinPage />} />
      <Route path="/password-changed" element={<PasswordChangedPage />} />
    </Routes>
  );
}