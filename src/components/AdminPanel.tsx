
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, DollarSign, Settings, BarChart3 } from 'lucide-react';
import Analytics from './Analytics';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings' | 'analytics' | 'settings'>('dashboard');

  // Mock data
  const recentBookings = [
    { id: 1, customer: 'John Doe', date: '2024-06-10', time: '10:00', service: 'Recording', status: 'confirmed' },
    { id: 2, customer: 'Jane Smith', date: '2024-06-10', time: '14:00', service: 'Mixing', status: 'pending' },
    { id: 3, customer: 'Mike Johnson', date: '2024-06-11', time: '16:00', service: 'Rehearsal', status: 'confirmed' },
  ];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Settings },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Today's Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">8</div>
            <p className="text-xs text-gray-300">+2 from yesterday</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Revenue Today</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">$600</div>
            <p className="text-xs text-gray-300">+15% from yesterday</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Active Users</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">24</div>
            <p className="text-xs text-gray-300">+3 new this week</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">{booking.customer}</p>
                  <p className="text-gray-300 text-sm">{booking.date} at {booking.time} - {booking.service}</p>
                </div>
                <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                  {booking.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBookings = () => (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">All Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentBookings.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex-1">
                <h4 className="text-white font-semibold">{booking.customer}</h4>
                <p className="text-gray-300">{booking.service} Session</p>
                <p className="text-gray-400 text-sm">{booking.date} at {booking.time}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                  {booking.status}
                </Badge>
                <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderSettings = () => (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Studio Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-white text-sm font-medium">Studio Name</label>
            <input
              type="text"
              defaultValue="SoundStudio Pro"
              className="w-full mt-1 p-2 bg-white/5 border border-white/20 rounded text-white"
            />
          </div>
          <div>
            <label className="text-white text-sm font-medium">Operating Hours</label>
            <input
              type="text"
              defaultValue="9:00 AM - 10:00 PM"
              className="w-full mt-1 p-2 bg-white/5 border border-white/20 rounded text-white"
            />
          </div>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-black">
          Save Settings
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex space-x-2 border-b border-white/10">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant="ghost"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary bg-primary/10'
                  : 'text-white hover:text-primary hover:bg-white/10'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'bookings' && renderBookings()}
        {activeTab === 'analytics' && <Analytics />}
        {activeTab === 'settings' && renderSettings()}
      </div>
    </div>
  );
};

export default AdminPanel;
