
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Clock, Calendar as CalendarIcon } from 'lucide-react';

interface BookingCalendarProps {
  onClose: () => void;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({ onClose }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [bookingType, setBookingType] = useState<'hourly' | 'multi-hour' | 'full-day'>('hourly');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const { toast } = useToast();

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  const handleTimeSelection = (slot: string) => {
    if (bookingType === 'full-day') return;
    
    if (bookingType === 'hourly') {
      setSelectedTimes([slot]);
    } else {
      // Multi-hour booking
      setSelectedTimes(prev => 
        prev.includes(slot) 
          ? prev.filter(time => time !== slot)
          : [...prev, slot].sort()
      );
    }
  };

  const handleBookingTypeChange = (type: 'hourly' | 'multi-hour' | 'full-day') => {
    setBookingType(type);
    if (type === 'full-day') {
      setSelectedTimes(timeSlots);
    } else {
      setSelectedTimes([]);
    }
  };

  const calculatePrice = () => {
    if (bookingType === 'full-day') return 500; // Full day rate
    return selectedTimes.length * 75; // $75 per hour
  };

  const getDuration = () => {
    if (bookingType === 'full-day') return 'Full Day (9:00 - 20:00)';
    if (selectedTimes.length === 1) return '1 hour';
    return `${selectedTimes.length} hours`;
  };

  const handleBooking = () => {
    if (!selectedDate || (!selectedTimes.length && bookingType !== 'full-day') || !customerName || !customerEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Booking Confirmed!",
      description: `Your ${bookingType} session is booked for ${selectedDate.toDateString()}.`,
    });
    onClose();
  };

  return (
    <div className="space-y-6">
      {/* Booking Type Selection */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Booking Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={bookingType === 'hourly' ? "default" : "outline"}
              onClick={() => handleBookingTypeChange('hourly')}
              className={
                bookingType === 'hourly'
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "border-2 border-white/40 text-white hover:bg-white/20 hover:text-white"
              }
            >
              <Clock className="mr-2 h-4 w-4" />
              Single Hour
            </Button>
            <Button
              variant={bookingType === 'multi-hour' ? "default" : "outline"}
              onClick={() => handleBookingTypeChange('multi-hour')}
              className={
                bookingType === 'multi-hour'
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "border-2 border-white/40 text-white hover:bg-white/20 hover:text-white"
              }
            >
              <Clock className="mr-2 h-4 w-4" />
              Multi Hours
            </Button>
            <Button
              variant={bookingType === 'full-day' ? "default" : "outline"}
              onClick={() => handleBookingTypeChange('full-day')}
              className={
                bookingType === 'full-day'
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "border-2 border-white/40 text-white hover:bg-white/20 hover:text-white"
              }
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              Full Day
            </Button>
          </div>
        </CardContent>
      </Card>

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
            <CardTitle className="text-white">
              {bookingType === 'full-day' ? 'Full Day Selected' : 'Select Time(s)'}
            </CardTitle>
            {bookingType === 'multi-hour' && (
              <p className="text-gray-300 text-sm">Select multiple hours for your session</p>
            )}
          </CardHeader>
          <CardContent>
            {bookingType === 'full-day' ? (
              <div className="p-4 bg-primary/20 rounded-lg border border-primary/30">
                <p className="text-white font-semibold">Full Day Booking</p>
                <p className="text-gray-300">9:00 AM - 8:00 PM (11 hours)</p>
                <p className="text-primary font-bold">$500</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((slot) => (
                  <Button
                    key={slot}
                    variant={selectedTimes.includes(slot) ? "default" : "outline"}
                    onClick={() => handleTimeSelection(slot)}
                    className={
                      selectedTimes.includes(slot)
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "border-2 border-white/40 text-white hover:bg-white/20 hover:text-white"
                    }
                  >
                    {slot}
                  </Button>
                ))}
              </div>
            )}
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
      {selectedDate && (selectedTimes.length > 0 || bookingType === 'full-day') && (
        <Card className="bg-primary/10 border-primary/20">
          <CardContent className="p-4">
            <h4 className="text-white font-semibold mb-2">Booking Summary</h4>
            <p className="text-gray-300">
              Date: {selectedDate.toDateString()}<br/>
              {bookingType === 'full-day' ? (
                <>Duration: Full Day (9:00 AM - 8:00 PM)</>
              ) : (
                <>
                  Time{selectedTimes.length > 1 ? 's' : ''}: {selectedTimes.join(', ')}<br/>
                  Duration: {getDuration()}
                </>
              )}
              <br/>
              Price: ${calculatePrice()}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={onClose}
          className="border-2 border-white/40 text-white hover:bg-white/20 hover:text-white hover:border-white/60"
        >
          Cancel
        </Button>
        <Button
          onClick={handleBooking}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
        >
          Confirm Booking
        </Button>
      </div>
    </div>
  );
};

export default BookingCalendar;
