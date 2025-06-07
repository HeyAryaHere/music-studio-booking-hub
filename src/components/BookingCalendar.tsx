
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Mail, CreditCard, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface BookingCalendarProps {
  onClose: () => void;
}

interface TimeSlot {
  time: string;
  available: boolean;
  price: number;
  type: string;
}

interface BookingDetails {
  date: string;
  time: string;
  duration: number;
  service: string;
  price: number;
  name: string;
  email: string;
  phone: string;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({ onClose }) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [duration, setDuration] = useState<number>(1);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [step, setStep] = useState<number>(1);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    date: '',
    time: '',
    duration: 1,
    service: '',
    price: 0,
    name: '',
    email: '',
    phone: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const services = [
    { id: 'recording', name: 'Recording Session', price: 75, description: 'Professional recording with engineer' },
    { id: 'mixing', name: 'Mixing Session', price: 60, description: 'Professional mixing and production' },
    { id: 'rehearsal', name: 'Rehearsal Space', price: 45, description: 'Band practice and rehearsal' }
  ];

  // Generate available time slots
  const generateTimeSlots = (date: string) => {
    const slots: TimeSlot[] = [];
    const startHour = 9;
    const endHour = 22;
    
    for (let hour = startHour; hour < endHour; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      // Simulate some booked slots
      const isBooked = Math.random() < 0.3;
      slots.push({
        time,
        available: !isBooked,
        price: selectedService ? services.find(s => s.id === selectedService)?.price || 75 : 75,
        type: selectedService || 'recording'
      });
    }
    
    return slots;
  };

  useEffect(() => {
    if (selectedDate) {
      setTimeSlots(generateTimeSlots(selectedDate));
    }
  }, [selectedDate, selectedService]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime('');
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    const service = services.find(s => s.id === serviceId);
    if (service) {
      setBookingDetails(prev => ({
        ...prev,
        service: service.name,
        price: service.price * duration
      }));
    }
  };

  const handleDurationChange = (newDuration: number) => {
    setDuration(newDuration);
    const service = services.find(s => s.id === selectedService);
    if (service) {
      setBookingDetails(prev => ({
        ...prev,
        duration: newDuration,
        price: service.price * newDuration
      }));
    }
  };

  const proceedToDetails = () => {
    if (!selectedDate || !selectedTime || !selectedService) {
      toast({
        title: "Please complete selection",
        description: "Select date, time, and service to continue",
        variant: "destructive"
      });
      return;
    }

    const service = services.find(s => s.id === selectedService);
    setBookingDetails({
      date: selectedDate,
      time: selectedTime,
      duration,
      service: service?.name || '',
      price: (service?.price || 75) * duration,
      name: '',
      email: '',
      phone: ''
    });
    setStep(2);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate API call for booking creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would integrate with Stripe
      // const response = await createStripeCheckout(bookingDetails);
      // window.open(response.url, '_blank');
      
      toast({
        title: "Booking Created!",
        description: "Redirecting to payment...",
      });
      
      setStep(3);
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "Please try again or contact support",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
  };

  if (step === 3) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
        <h3 className="text-2xl font-bold text-white mb-4">Booking Confirmed!</h3>
        <p className="text-gray-300 mb-6">
          Your session for {formatDate(bookingDetails.date)} at {bookingDetails.time} has been booked.
          You'll receive a confirmation email shortly.
        </p>
        <div className="bg-white/5 rounded-lg p-6 max-w-md mx-auto mb-6">
          <h4 className="text-white font-semibold mb-4">Booking Summary</h4>
          <div className="space-y-2 text-sm text-gray-300">
            <div className="flex justify-between">
              <span>Service:</span>
              <span>{bookingDetails.service}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{formatDate(bookingDetails.date)}</span>
            </div>
            <div className="flex justify-between">
              <span>Time:</span>
              <span>{bookingDetails.time}</span>
            </div>
            <div className="flex justify-between">
              <span>Duration:</span>
              <span>{bookingDetails.duration} hour(s)</span>
            </div>
            <div className="flex justify-between font-semibold border-t border-white/10 pt-2">
              <span>Total:</span>
              <span>${bookingDetails.price}</span>
            </div>
          </div>
        </div>
        <Button onClick={onClose} className="bg-primary hover:bg-primary/90 text-black">
          Close
        </Button>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-2">Booking Details</h3>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Service:</span>
                <span className="text-white ml-2">{bookingDetails.service}</span>
              </div>
              <div>
                <span className="text-gray-400">Date:</span>
                <span className="text-white ml-2">{formatDate(bookingDetails.date)}</span>
              </div>
              <div>
                <span className="text-gray-400">Time:</span>
                <span className="text-white ml-2">{bookingDetails.time}</span>
              </div>
              <div>
                <span className="text-gray-400">Total:</span>
                <span className="text-primary ml-2 font-semibold">${bookingDetails.price}</span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleBookingSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-white">Full Name</Label>
              <Input
                id="name"
                type="text"
                required
                value={bookingDetails.name}
                onChange={(e) => setBookingDetails(prev => ({ ...prev, name: e.target.value }))}
                className="bg-white/5 border-white/10 text-white"
                placeholder="Your full name"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={bookingDetails.email}
                onChange={(e) => setBookingDetails(prev => ({ ...prev, email: e.target.value }))}
                className="bg-white/5 border-white/10 text-white"
                placeholder="your@email.com"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="phone" className="text-white">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              required
              value={bookingDetails.phone}
              onChange={(e) => setBookingDetails(prev => ({ ...prev, phone: e.target.value }))}
              className="bg-white/5 border-white/10 text-white"
              placeholder="(555) 123-4567"
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(1)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={isProcessing}
              className="bg-primary hover:bg-primary/90 text-black flex-1"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Proceed to Payment
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Service Selection */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Select Service</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {services.map((service) => (
            <Card
              key={service.id}
              className={`cursor-pointer transition-all duration-300 ${
                selectedService === service.id
                  ? 'bg-primary/20 border-primary'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
              onClick={() => handleServiceSelect(service.id)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg">{service.name}</CardTitle>
                <div className="text-2xl font-bold text-primary">${service.price}/hr</div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Duration Selection */}
      {selectedService && (
        <div>
          <Label className="text-white text-lg mb-3 block">Duration</Label>
          <Select value={duration.toString()} onValueChange={(value) => handleDurationChange(parseInt(value))}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6].map((hours) => (
                <SelectItem key={hours} value={hours.toString()}>
                  {hours} hour{hours > 1 ? 's' : ''} - ${(services.find(s => s.id === selectedService)?.price || 75) * hours}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Date Selection */}
      <div>
        <Label className="text-white text-lg mb-3 block">Select Date</Label>
        <Select value={selectedDate} onValueChange={handleDateSelect}>
          <SelectTrigger className="bg-white/5 border-white/10 text-white">
            <SelectValue placeholder="Choose a date" />
          </SelectTrigger>
          <SelectContent>
            {generateDateOptions().map((date) => (
              <SelectItem key={date} value={date}>
                {formatDate(date)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div>
          <Label className="text-white text-lg mb-3 block">Available Times</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-60 overflow-y-auto">
            {timeSlots.map((slot) => (
              <Button
                key={slot.time}
                variant={selectedTime === slot.time ? "default" : "outline"}
                disabled={!slot.available}
                onClick={() => handleTimeSelect(slot.time)}
                className={`h-12 ${
                  selectedTime === slot.time
                    ? 'bg-primary text-black hover:bg-primary/90'
                    : slot.available
                    ? 'border-white/20 text-white hover:bg-white/10'
                    : 'border-white/10 text-gray-500 cursor-not-allowed'
                }`}
              >
                <div className="text-center">
                  <div className="font-semibold">{slot.time}</div>
                  {slot.available && <div className="text-xs opacity-75">${slot.price}/hr</div>}
                  {!slot.available && <div className="text-xs">Booked</div>}
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Continue Button */}
      {selectedDate && selectedTime && selectedService && (
        <div className="flex justify-end pt-6 border-t border-white/10">
          <Button
            onClick={proceedToDetails}
            className="bg-primary hover:bg-primary/90 text-black px-8"
          >
            Continue to Details
          </Button>
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;
