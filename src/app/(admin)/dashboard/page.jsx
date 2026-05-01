"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Train,
  TrendingUp,
  Users,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  BarChart3,
  ArrowUpDown,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [trains, setTrains] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [scheduleSort, setScheduleSort] = useState("date-asc");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelError, setCancelError] = useState("");

  const adminProfile = JSON.parse(
    localStorage.getItem("railx_admin_profile") || "{}",
  );

  const fetchData = useCallback(async (token) => {
    try {
      const [statsRes, trainsRes, schedulesRes, bookingsRes] =
        await Promise.all([
          fetch("http://localhost:5001/api/admin/stats/dashboard", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:5001/api/admin/trains", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:5001/api/admin/schedules?limit=all", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:5001/api/admin/bookings", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (trainsRes.ok) setTrains((await trainsRes.json()).trains);
      if (schedulesRes.ok) setSchedules((await schedulesRes.json()).schedules);
      if (bookingsRes.ok) setBookings((await bookingsRes.json()).bookings);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(adminProfile.token);
  }, [fetchData, adminProfile.token]);

  const handleLogout = () => {
    localStorage.removeItem("railx_admin_profile");
    router.push("/admin/login");
  };

  const handleDeleteTrain = async (id) => {
    if (!confirm("Are you sure you want to delete this train?")) return;

    try {
      const profile = JSON.parse(
        localStorage.getItem("railx_admin_profile") || "{}",
      );
      const response = await fetch(
        `http://localhost:5001/api/admin/trains/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${profile.token}` },
        },
      );

      if (response.ok) {
        setTrains(trains.filter((t) => t._id !== id));
      }
    } catch (error) {
      console.error("Failed to delete train:", error);
    }
  };

  const getSortedSchedules = () => {
    const sorted = [...schedules];
    if (scheduleSort === "date-asc") {
      return sorted.sort(
        (a, b) =>
          new Date(a.travel_date).getTime() - new Date(b.travel_date).getTime(),
      );
    } else if (scheduleSort === "date-desc") {
      return sorted.sort(
        (a, b) =>
          new Date(b.travel_date).getTime() - new Date(a.travel_date).getTime(),
      );
    } else if (scheduleSort === "fare") {
      return sorted.sort((a, b) => a.base_fare - b.base_fare);
    } else if (scheduleSort === "seats") {
      return sorted.sort((a, b) => b.available_seats - a.available_seats);
    }
    return sorted;
  };

  const handleDeleteSchedule = async (id) => {
    if (!confirm("Are you sure you want to delete this schedule?")) return;

    try {
      const profile = JSON.parse(
        localStorage.getItem("railx_admin_profile") || "{}",
      );
      const response = await fetch(
        `http://localhost:5001/api/admin/schedules/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${profile.token}` },
        },
      );

      if (response.ok) {
        setSchedules(schedules.filter((s) => s._id !== id));
      }
    } catch (error) {
      console.error("Failed to delete schedule:", error);
    }
  };

  const openCancelModal = (bookingId) => {
    setSelectedBookingId(bookingId);
    setCancelReason("");
    setCancelError("");
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setSelectedBookingId(null);
    setCancelReason("");
    setCancelError("");
  };

  const handleAdminCancelBooking = async () => {
    if (!selectedBookingId || !cancelReason.trim()) {
      setCancelError("Please enter a cancellation reason.");
      return;
    }

    try {
      const profile = JSON.parse(
        localStorage.getItem("railx_admin_profile") || "{}",
      );
      const response = await fetch(
        `http://localhost:5001/api/admin/bookings/${selectedBookingId}/cancel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${profile.token}`,
          },
          body: JSON.stringify({ cancellation_reason: cancelReason.trim() }),
        },
      );

      if (!response.ok) {
        const data = await response.json();
        setCancelError(data.message || "Failed to cancel booking");
        return;
      }

      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === selectedBookingId
            ? { ...booking, status: "Cancelled" }
            : booking,
        ),
      );
      closeCancelModal();
    } catch (error) {
      setCancelError(error.message || "Failed to cancel booking");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {}
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link
            href="/admin/dashboard"
            className="text-2xl font-bold tracking-tighter"
          >
            RAILX ADMIN
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              {adminProfile?.admin?.username || adminProfile?.username}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-white/20 rounded-full hover:bg-red-500 hover:border-red-500 transition-all flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {}
        <div className="flex gap-4 mb-8 border-b border-white/10">
          {["overview", "trains", "schedules", "bookings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium transition-all capitalize ${
                activeTab === tab
                  ? "border-b-2 border-white text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {}
        {activeTab === "overview" && stats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                title: "Total Bookings",
                value: stats.totalBookings,
                icon: BarChart3,
              },
              {
                title: "Total Passengers",
                value: stats.totalPassengers,
                icon: Users,
              },
              { title: "Total Trains", value: stats.totalTrains, icon: Train },
              {
                title: "Total Revenue",
                value: `₹${stats.totalRevenue}`,
                icon: TrendingUp,
              },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-6 bg-white/5 border border-white/10 rounded-xl"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-gray-400 text-sm">{stat.title}</h3>
                    <Icon className="w-5 h-5 text-white/50" />
                  </div>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {}
        {activeTab === "trains" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Manage Trains</h2>
              <Link href="/admin/trains/new">
                <button className="px-6 py-2 bg-white text-black rounded-lg font-semibold flex items-center gap-2 hover:bg-white/90 transition-all">
                  <Plus className="w-4 h-4" />
                  Add Train
                </button>
              </Link>
            </div>

            <div className="space-y-4">
              {trains.map((train) => (
                <div
                  key={train._id}
                  className="p-6 bg-white/5 border border-white/10 rounded-xl flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-lg font-bold">{train.train_name}</h3>
                    <p className="text-gray-400 text-sm">
                      {train.train_number} • {train.train_type} •{" "}
                      {train.total_seats} seats
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Link href={`/admin/trains/${train._id}`}>
                      <button className="p-2 border border-white/20 rounded-lg hover:bg-white/10 transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDeleteTrain(train._id)}
                      className="p-2 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-all"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "schedules" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold mb-4">Manage Schedules</h2>
                <div className="flex gap-3">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="w-4 h-4 text-gray-400" />
                    <select
                      value={scheduleSort}
                      onChange={(e) => setScheduleSort(e.target.value)}
                      className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm hover:bg-white/15 transition-all"
                    >
                      <option value="date-asc">
                        Sort by Date (Earliest First)
                      </option>
                      <option value="date-desc">
                        Sort by Date (Latest First)
                      </option>
                      <option value="fare">Sort by Fare (Low to High)</option>
                      <option value="seats">
                        Sort by Available Seats (High to Low)
                      </option>
                    </select>
                  </div>
                  <span className="text-sm text-gray-400 flex items-center">
                    ({schedules.length} schedules)
                  </span>
                </div>
              </div>
              <Link href="/admin/schedules/new">
                <button className="px-6 py-2 bg-white text-black rounded-lg font-semibold flex items-center gap-2 hover:bg-white/90 transition-all">
                  <Plus className="w-4 h-4" />
                  Add Schedule
                </button>
              </Link>
            </div>

            <div className="space-y-4">
              {getSortedSchedules().map((schedule) => (
                <div
                  key={schedule._id}
                  className="p-6 bg-white/5 border border-white/10 rounded-xl flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-lg font-bold">
                      {schedule.train_id?.train_name || "Train"}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {schedule.from_station?.station_name} →{" "}
                      {schedule.to_station?.station_name} •{" "}
                      {new Date(schedule.travel_date).toLocaleDateString()} •
                      {schedule.available_seats} seats • ₹{schedule.base_fare}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Link href={`/admin/schedules/${schedule._id}`}>
                      <button className="p-2 border border-white/20 rounded-lg hover:bg-white/10 transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDeleteSchedule(schedule._id)}
                      className="p-2 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-all"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {}
        {activeTab === "bookings" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-bold mb-6">All Bookings</h2>
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="p-6 bg-white/5 border border-white/10 rounded-xl"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-lg">
                        PNR: {booking.pnr_number}
                      </p>
                      <p className="text-gray-400 text-sm">
                        Passenger: {booking.passenger_id?.name}
                      </p>
                      {booking.passenger_details &&
                        booking.passenger_details.length > 0 && (
                          <div className="mt-2 text-sm">
                            <p className="text-gray-300 font-medium">
                              Passengers ({booking.passenger_details.length}):
                            </p>
                            <div className="ml-2 text-gray-400 space-y-1">
                              {booking.passenger_details.map((p, idx) => (
                                <p key={idx}>
                                  {idx + 1}. {p.name} (Age: {p.age}, {p.gender})
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        booking.status === "Confirmed"
                          ? "bg-green-500/20 text-green-300"
                          : "bg-red-500/20 text-red-300"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Total Fare: ₹{booking.total_fare} • Booked:{" "}
                    {new Date(booking.booking_date).toLocaleDateString()}
                  </p>
                  {booking.status === "Confirmed" && (
                    <div className="mt-4">
                      <button
                        onClick={() => openCancelModal(booking._id)}
                        className="px-4 py-2 bg-red-600/20 border border-red-500/30 text-red-300 rounded-lg hover:bg-red-600/30 transition-all flex items-center gap-2 text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Cancel Ticket
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>

      {showCancelModal && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-4"
          onClick={closeCancelModal}
        >
          <div
            className="w-full max-w-lg bg-black border border-white/20 rounded-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-2">Admin Cancel Ticket</h3>
            <p className="text-sm text-gray-400 mb-4">
              Provide a reason for cancelling this booking.
            </p>

            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-white/40 resize-none"
              placeholder="Enter cancellation reason..."
            />

            {cancelError && (
              <p className="mt-3 text-sm text-red-400">{cancelError}</p>
            )}

            <div className="mt-5 flex gap-3">
              <button
                onClick={handleAdminCancelBooking}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all"
              >
                Confirm Cancel
              </button>
              <button
                onClick={closeCancelModal}
                className="flex-1 py-2.5 border border-white/20 rounded-lg font-semibold hover:bg-white/10 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
