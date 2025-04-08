"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaBuilding, FaBell, FaCogs, FaChartLine } from "react-icons/fa";
import { useAuthStore } from "@/app/lib/store";

export default function Dashboard() {
  const { user, token, clearAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!token || !user) {
      router.push("/");
    }
  }, [token, user, router]);

  if (!user) return null; // Redirecting

  const handleLogout = () => {
    clearAuth();
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">BMS Hub</h1>
        <div className="flex space-x-4">
          <NavTab label="Facility" icon={<FaBuilding />} />
          <NavTab label="Devices" icon={<FaCogs />} />
          <NavTab label="Alarms" icon={<FaBell />} />
          <NavTab label="Logs" icon={<FaChartLine />} />
          {user.role === "engineer" && <NavTab label="Logic Map" icon={<FaCogs />} />}
          <div className="flex items-center space-x-2">
            <span>{user.name} ({user.role})</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-2 py-1 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <main className="flex-1 p-6">
        <h2 className="text-2xl font-semibold mb-4">Dashboard Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="Active Points" value="5" />
          <Card title="Alarms" value="1" color="bg-red-100" />
          <Card title="System Status" value="Online" color="bg-green-100" />
        </div>
      </main>
    </div>
  );
}

function NavTab({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <button className="flex items-center space-x-1 hover:bg-blue-700 p-2 rounded">
      {icon}
      <span>{label}</span>
    </button>
  );
}

function Card({ title, value, color = "bg-white" }: { title: string; value: string; color?: string }) {
  return (
    <div className={`${color} p-4 rounded shadow`}>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-2xl">{value}</p>
    </div>
  );
}