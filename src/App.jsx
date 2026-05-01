import { Navigate, Route, Routes } from "react-router-dom";
import { Providers } from "@/components/providers";
import ProtectedLayout from "@/app/(protected)/layout";
import AdminLayout from "@/app/(admin)/layout";

import HomePage from "@/app/page";
import LoginPage from "@/app/login/page";
import RegisterPage from "@/app/register/page";
import AdminLoginPage from "@/app/adminlogin/page";
import AdminDashboardPage from "@/app/(admin)/dashboard/page";
import AdminTrainPage from "@/app/(admin)/trains/[id]/page";
import AdminSchedulePage from "@/app/(admin)/schedules/[id]/page";

import SearchPage from "@/app/(protected)/search/page";
import BookingPage from "@/app/(protected)/booking/page";
import SeatSelectionPage from "@/app/(protected)/seat-selection/page";
import ConfirmationPage from "@/app/(protected)/confirmation/page";
import PaymentPage from "@/app/(protected)/payment/page";
import CancellationPage from "@/app/(protected)/cancellation/page";
import NotificationsPage from "@/app/(protected)/notifications/page";
import ProfilePage from "@/app/(protected)/profile/page";
import DashboardPage from "@/app/(protected)/dashboard/page";

function ProtectedRoutes() {
  return (
    <ProtectedLayout>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/seat-selection" element={<SeatSelectionPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/cancellation" element={<CancellationPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </ProtectedLayout>
  );
}

function AdminRoutes() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="trains/:id" element={<AdminTrainPage />} />
        <Route path="schedules/:id" element={<AdminSchedulePage />} />
      </Routes>
    </AdminLayout>
  );
}

export default function App() {
  return (
    <Providers>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/*" element={<ProtectedRoutes />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Providers>
  );
}
