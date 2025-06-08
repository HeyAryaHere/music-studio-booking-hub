
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Mail, CreditCard, CheckCircle, Plus, Minus } from 'lucide-react';
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
  timeSlots: string[];
  isFullDay: boolean;
  service: string;
  price: number;
  name: string;
  email: string;
  phone: string;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({ onClose }) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [isFullDay, setIsFullDay] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<string>('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [step, setStep] = useState<number>(1);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    date: '',
    timeSlots: [],
    isFullDay: false,
    service: '',
    price: 0,
    name: '',
    email: '',
    phone: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const services = [
    { id: 'recording', name: 'Recording Session', price: 75, description: 'Professional recording with engineer', fullDayPrice: 500 },
    { id: 'mixing', name: 'Mixing Session', price: 60, description: 'Professional mixing and production', fullDayPrice: 400 },
    { id: 'rehearsal', name: 'Rehearsal Space', price: 45, description: 'Band practice and rehearsal', fullDayPrice: 300 }
  ];

  // Generate available time slots
  const generateTimeSlots = (date: string) => {
    const slots: TimeSlot[] = [];
    const startHour = 9;
    const endHour = 22;
    
    for (let hour = startHour; hour < endHour; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      // Simulate some booked slots
      const isBooked = Math.random() < 0.2; // Reduced booking rate to show more availability
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
    setSelectedTimeSlots([]);
    setIsFullDay(false);
  };

  const handleTimeSlotToggle = (time: string) => {
    if (isFullDay) return; // Don't allow individual slots when full day is selected
    
    setSelectedTimeSlots(prev => {
      if (prev.includes(time)) {
        return prev.filter(t => t !== time);
      } else if (prev.length < 4) { // Max 4 time slots
        return [...prev, time].sort();
      } else {
        toast({
          title: "Maximum slots reached",
          description: "You can select up to 4 time slots maximum",
          variant: "destructive"
        });
        return prev;
      }
    });
  };

  const handleFullDayToggle = () => {
    setIsFullDay(!isFullDay);
    if (!isFullDay) {
      setSelectedTimeSlots([]);
    }
  };

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    const service = services.find(s => s.id === serviceId);
    if (service) {
      const price = isFullDay 
        ? service.fullDayPrice 
        : service.price * (selectedTimeSlots.length || 1);
      
      setBookingDetails(prev => ({
        ...prev,
        service: service.name,
        price
      }));
    }
  };

  const calculatePrice = () => {
    const service = services.find(s => s.id === selectedService);
    if (!service) return 0;
    
    if (isFullDay) {
      return service.fullDayPrice;
    }
    
    return service.price * selectedTimeSlots.length;
  };

  const proceedToDetails = () => {
    if (!selectedDate || !selectedService) {
      toast({
        title: "Please complete selection",
        description: "Select date and service to continue",
        variant: "destructive"
      });
      return;
    }

    if (!isFullDay && selectedTimeSlots.length === 0) {
      toast({
        title: "Please select time slots",
        description: "Select at least one time slot or choose full day booking",
        variant: "destructive"
      });
      return;
    }

    const service = services.find(s => s.id === selectedService);
    setBookingDetails({
      date: selectedDate,
      timeSlots: isFullDay ? ['Full Day (9:00 - 22:00)'] : selectedTimeSlots,
      isFullDay,
      service: service?.name || '',
      price: calculatePrice(),
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
      // STRIPE INTEGRATION POINT:
      // This is where you'll integrate Stripe payment
      // Replace this section with actual Stripe integration
      
      // Example Stripe integration (you'll need to implement the backend endpoint):
      /*
      const response = await fetch('/api/create-stripe-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingDetails,
          // Add other necessary data
        }),
      });
      
      const { sessionId } = await response.json();
      
      // Redirect to Stripe Checkout
      const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
      await stripe.redirectToCheckout({ sessionId });
      */
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      
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
      const dateString = date.toISOString().split('T')[0];
      
      // Simulate some days having no bookings (show availability indicator)
      const hasAvailability = Math.random() > 0.3; // 70% chance of availability
      
      dates.push({
        value: dateString,
        label: formatDate(dateString),
        hasAvailability
      });
    }
    
    return dates;
  };

  if (step === 3) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-6" />
        <h3 className="text-2xl font-bold text-white mb-4">Booking Confirmed!</h3>
        <p className="text-gray-300 mb-6">
          Your session for {formatDate(bookingDetails.date)} has been booked.
          You'll receive a confirmation email shortly.
        </p>
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 max-w-md mx-auto mb-6">
          <h4 className="text-white font-semibold mb-4">Booking Summary</h4>
          <div className="space-y-2 text-sm text-gray-300">
            <div className="flex justify-between">
              <span>Service:</span>
              <span className="text-white">{bookingDetails.service}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span className="text-white">{formatDate(bookingDetails.date)}</span>
            </div>
            <div className="flex justify-between">
              <span>Time:</span>
              <span className="text-white">
                {bookingDetails.isFullDay 
                  ? 'Full Day (9:00 - 22:00)' 
                  : bookingDetails.timeSlots.join(', ')
                }
              </span>
            </div>
            <div className="flex justify-between font-semibold border-t border-slate-600 pt-2">
              <span>Total:</span>
              <span className="text-primary">${bookingDetails.price}</span>
            </div>
          </div>
        </div>
        <Button 
          onClick={onClose} 
          className="bg-primary hover:bg-primary/90 text-black font-semibold"
        >
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
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
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
                <span className="text-white ml-2">
                  {bookingDetails.isFullDay 
                    ? 'Full Day (9:00 - 22:00)' 
                    : bookingDetails.timeSlots.join(', ')
                  }
                </span>
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
                className="bg-slate-800 border-slate-600 text-white placeholder:text-gray-400 focus:border-primary"
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
                className="bg-slate-800 border-slate-600 text-white placeholder:text-gray-400 focus:border-primary"
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
              className="bg-slate-800 border-slate-600 text-white placeholder:text-gray-400 focus:border-primary"
              placeholder="(555) 123-4567"
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(1)}
              className="border-slate-600 text-white hover:bg-slate-800 hover:text-white"
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={isProcessing}
              className="bg-primary hover:bg-primary/90 text-black flex-1 font-semibold"
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
                  ? 'bg-primary/20 border-primary ring-2 ring-primary/50'
                  : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 hover:border-slate-600'
              }`}
              onClick={() => handleServiceSelect(service.id)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg">{service.name}</CardTitle>
                <div className="space-y-1">
                  <div className="text-xl font-bold text-primary">${service.price}/hr</div>
                  <div className="text-sm text-gray-400">Full day: ${service.fullDayPrice}</div>
                </div>
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

      {/* Date Selection */}
      <div>
        <Label className="text-white text-lg mb-3 block">Select Date</Label>
        <Select value={selectedDate} onValueChange={handleDateSelect}>
          <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
            <SelectValue placeholder="Choose a date" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-600">
            {generateDateOptions().map((dateOption) => (
              <SelectItem 
                key={dateOption.value} 
                value={dateOption.value}
                className="text-white hover:bg-slate-700"
              >
                <div className="flex items-center justify-between w-full">
                  <span>{dateOption.label}</span>
                  <span className={`ml-2 text-xs px-2 py-1 rounded ${
                    dateOption.hasAvailability 
                      ? 'bg-green-900 text-green-300' 
                      : 'bg-red-900 text-red-300'
                  }`}>
                    {dateOption.hasAvailability ? 'Available' : 'Limited'}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Full Day Option */}
      {selectedDate && selectedService && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-semibold">Full Day Booking</h4>
              <p className="text-gray-400 text-sm">Book the entire day (9:00 AM - 10:00 PM)</p>
              <p className="text-primary font-semibold">
                ${services.find(s => s.id === selectedService)?.fullDayPrice}
              </p>
            </div>
            <Button
              type="button"
              variant={isFullDay ? "default" : "outline"}
              onClick={handleFullDayToggle}
              className={isFullDay 
                ? "bg-primary text-black hover:bg-primary/90" 
                : "border-slate-600 text-white hover:bg-slate-700"
              }
            >
              {isFullDay ? 'Full Day Selected' : 'Select Full Day'}
            </Button>
          </div>
        </div>
      )}

      {/* Time Selection */}
      {selectedDate && selectedService && !isFullDay && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="text-white text-lg">Select Time Slots</Label>
            <div className="text-sm text-gray-400">
              Selected: {selectedTimeSlots.length}/4 slots
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-60 overflow-y-auto">
            {timeSlots.map((slot) => {
              const isSelected = selectedTimeSlots.includes(slot.time);
              return (
                <Button
                  key={slot.time}
                  variant="outline"
                  disabled={!slot.available}
                  onClick={() => handleTimeSlotToggle(slot.time)}
                  className={`h-16 relative transition-all ${
                    isSelected
                      ? 'bg-primary text-black border-primary hover:bg-primary/90'
                      : slot.available
                      ? 'border-slate-600 text-white hover:bg-slate-800 hover:border-slate-500'
                      : 'border-slate-700 text-gray-500 cursor-not-allowed bg-slate-900'
                  }`}
                >
                  <div className="text-center">
                    <div className="font-semibold">{slot.time}</div>
                    {slot.available && <div className="text-xs opacity-75">${slot.price}/hr</div>}
                    {!slot.available && <div className="text-xs">Booked</div>}
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 bg-green-400 text-black rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        ✓
                      </div>
                    )}
                  </div>
                </Button>
              );
            })}
          </div>
          
          {selectedTimeSlots.length > 0 && (
            <div className="mt-4 p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Selected slots:</span>
                <span className="text-white">{selectedTimeSlots.join(', ')}</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-1">
                <span className="text-gray-400">Total price:</span>
                <span className="text-primary font-semibold">${calculatePrice()}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Continue Button */}
      {selectedDate && selectedService && (isFullDay || selectedTimeSlots.length > 0) && (
        <div className="flex justify-end pt-6 border-t border-slate-700">
          <Button
            onClick={proceedToDetails}
            className="bg-primary hover:bg-primary/90 text-black px-8 font-semibold"
          >
            Continue to Details
          </Button>
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;
