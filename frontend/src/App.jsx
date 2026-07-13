import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import ForgotPasswordPage from "./pages/login/ForgotPasswordPage";
import ResetPinPage from "./pages/login/ResetPinPage";
import PasswordChangedPage from "./pages/login/PasswordChangedPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import WorkOrderDetailPage from "./pages/workorder/WorkOrderDetailPage";
import WorkOrdersPage from "./pages/workorder/WorkOrdersPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-pin" element={<ResetPinPage />} />
      <Route path="/password-changed" element={<PasswordChangedPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/work-order/:id" element={<WorkOrderDetailPage />} />
      <Route path="/work-orders" element={<WorkOrdersPage />} />
    </Routes>
  );
}