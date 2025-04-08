"use client";

import { useEffect, useState } from "react";
import { FaRegBuilding, FaBell, FaGears, FaChartLine } from "react-icons/fa6";
import { Button } from '@/app/components/Button';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ role: string; name: string } | null>(null);

  // Simulate fetching user data (replace with real auth later)
  useEffect(() => {
    setUser({ role: "engineer", name: "John Doe" }); // Mock user
  }, []);

  const handleLogout = () => {
    // Add logout logic here
    router.push('/');
  };

  const handleNavigation = (route: string) => {
    router.push(`/dashboard/${route.toLowerCase()}`);
  };

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">BMS Hub</h1>
        <div className="flex space-x-4">
          <NavTab 
            label="Facility" 
            icon={<FaRegBuilding />} 
            onClick={() => handleNavigation('facility')}
          />
          <NavTab 
            label="Devices" 
            icon={<FaGears />} 
            onClick={() => handleNavigation('devices')}
          />
          <NavTab 
            label="Alarms" 
            icon={<FaBell />} 
            onClick={() => handleNavigation('alarms')}
          />
          <NavTab 
            label="Logs" 
            icon={<FaChartLine />} 
            onClick={() => handleNavigation('logs')}
          />
          {user.role === "engineer" && (
            <NavTab 
              label="Logic Map" 
              icon={<FaGears />} 
              onClick={() => handleNavigation('logic-map')}
            />
          )}
          <div className="flex items-center space-x-2 border-l pl-4 ml-4 border-blue-500">
            <span className="text-sm">{user.name} ({user.role})</span>
            <Button 
              variant="secondary"
              size="sm"
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50">
        <h2 className="text-2xl font-semibold mb-6">Dashboard Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card 
            title="Active Points" 
            value="5" 
            trend="+2 from yesterday"
          />
          <Card 
            title="Alarms" 
            value="1" 
            color="bg-red-50" 
            trend="Critical"
            trendColor="text-red-600"
          />
          <Card 
            title="System Status" 
            value="Online" 
            color="bg-green-50" 
            trend="All systems operational"
            trendColor="text-green-600"
          />
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {/* Add recent activity items here */}
          </div>
        </div>
      </main>
    </div>
  );
}

// NavTab Component
interface NavTabProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

function NavTab({ label, icon, onClick }: NavTabProps) {
  return (
    <button 
      className="flex items-center space-x-1 hover:bg-blue-700 p-2 rounded transition-colors duration-200"
      onClick={onClick}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-sm">{label}</span>
    </button>
  );
}

// Card Component
interface CardProps {
  title: string;
  value: string;
  color?: string;
  trend?: string;
  trendColor?: string;
}

function Card({ title, value, color = "bg-white", trend, trendColor = "text-gray-500" }: CardProps) {
  return (
    <div className={`${color} p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200`}>
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <p className="text-3xl font-semibold mt-2 mb-1">{value}</p>
      {trend && (
        <p className={`text-sm ${trendColor}`}>{trend}</p>
      )}
    </div>
  );
}

