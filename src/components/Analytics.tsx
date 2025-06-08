
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Calendar, DollarSign, Users, Clock } from 'lucide-react';

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');

  // Mock data for different periods
  const weeklyData = [
    { name: 'Mon', bookings: 4, revenue: 300 },
    { name: 'Tue', bookings: 6, revenue: 450 },
    { name: 'Wed', bookings: 8, revenue: 600 },
    { name: 'Thu', bookings: 5, revenue: 375 },
    { name: 'Fri', bookings: 12, revenue: 900 },
    { name: 'Sat', bookings: 15, revenue: 1125 },
    { name: 'Sun', bookings: 10, revenue: 750 }
  ];

  const monthlyData = [
    { name: 'Week 1', bookings: 35, revenue: 2625 },
    { name: 'Week 2', bookings: 42, revenue: 3150 },
    { name: 'Week 3', bookings: 38, revenue: 2850 },
    { name: 'Week 4', bookings: 45, revenue: 3375 }
  ];

  const yearlyData = [
    { name: 'Jan', bookings: 180, revenue: 13500 },
    { name: 'Feb', bookings: 165, revenue: 12375 },
    { name: 'Mar', bookings: 195, revenue: 14625 },
    { name: 'Apr', bookings: 210, revenue: 15750 },
    { name: 'May', bookings: 225, revenue: 16875 },
    { name: 'Jun', bookings: 240, revenue: 18000 },
    { name: 'Jul', bookings: 255, revenue: 19125 },
    { name: 'Aug', bookings: 230, revenue: 17250 },
    { name: 'Sep', bookings: 220, revenue: 16500 },
    { name: 'Oct', bookings: 205, revenue: 15375 },
    { name: 'Nov', bookings: 190, revenue: 14250 },
    { name: 'Dec', bookings: 200, revenue: 15000 }
  ];

  const getData = () => {
    switch (selectedPeriod) {
      case 'weekly': return weeklyData;
      case 'monthly': return monthlyData;
      case 'yearly': return yearlyData;
      default: return weeklyData;
    }
  };

  const getTotalBookings = () => {
    return getData().reduce((sum, item) => sum + item.bookings, 0);
  };

  const getTotalRevenue = () => {
    return getData().reduce((sum, item) => sum + item.revenue, 0);
  };

  const getAverageBookings = () => {
    const data = getData();
    return Math.round(data.reduce((sum, item) => sum + item.bookings, 0) / data.length);
  };

  const chartConfig = {
    bookings: {
      label: "Bookings",
      color: "hsl(var(--primary))"
    },
    revenue: {
      label: "Revenue",
      color: "hsl(var(--primary))"
    }
  };

  return (
    <div className="space-y-6">
      {/* Period Selection */}
      <div className="flex space-x-2">
        {(['weekly', 'monthly', 'yearly'] as const).map((period) => (
          <Button
            key={period}
            variant={selectedPeriod === period ? "default" : "outline"}
            onClick={() => setSelectedPeriod(period)}
            className={
              selectedPeriod === period
                ? "bg-primary text-black hover:bg-primary/90"
                : "border-white/20 text-white hover:bg-white/10 hover:border-white/40"
            }
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </Button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{getTotalBookings()}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${getTotalRevenue().toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Average Bookings</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{getAverageBookings()}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Avg Revenue/Booking</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${Math.round(getTotalRevenue() / getTotalBookings())}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Bookings Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getData()}>
                  <XAxis dataKey="name" stroke="#ffffff" />
                  <YAxis stroke="#ffffff" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="bookings" fill="var(--color-bookings)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getData()}>
                  <XAxis dataKey="name" stroke="#ffffff" />
                  <YAxis stroke="#ffffff" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="var(--color-revenue)" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
