
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface BookingCalendarProps {
  onClose: () => void;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({ onClose }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const { toast } = useToast();

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  const handleBooking = () => {
    if (!selectedDate || !selectedTime || !customerName || !customerEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Booking Confirmed!",
      description: `Your session is booked for ${selectedDate.toDateString()} at ${selectedTime}.`,
    });
    onClose();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date()}
              className="rounded-md border border-white/20 bg-white/5 text-white"
            />
          </CardContent>
        </Card>

        {/* Time Selection */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Select Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((slot) => (
                <Button
                  key={slot}
                  variant={selectedTime === slot ? "default" : "outline"}
                  onClick={() => setSelectedTime(slot)}
                  className={
                    selectedTime === slot
                      ? "bg-primary text-black hover:bg-primary/90"
                      : "border-white/20 text-white hover:bg-white/10 hover:border-white/40"
                  }
                >
                  {slot}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Information */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Your Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-white">Full Name *</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-primary"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-white">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-primary"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Summary */}
      {selectedDate && selectedTime && (
        <Card className="bg-primary/10 border-primary/20">
          <CardContent className="p-4">
            <h4 className="text-white font-semibold mb-2">Booking Summary</h4>
            <p className="text-gray-300">
              Date: {selectedDate.toDateString()}<br/>
              Time: {selectedTime}<br/>
              Duration: 1 hour<br/>
              Price: $75
            </p>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={onClose}
          className="border-white/20 text-white hover:bg-white/10 hover:border-white/40"
        >
          Cancel
        </Button>
        <Button
          onClick={handleBooking}
          className="bg-primary hover:bg-primary/90 text-black font-semibold"
        >
          Confirm Booking
        </Button>
      </div>
    </div>
  );
};

export default BookingCalendar;
