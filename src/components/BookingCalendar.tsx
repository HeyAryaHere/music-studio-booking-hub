import React, { useState } from 'react';
import { Calendar, Clock, User, Mail, Phone, CreditCard, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface BookingCalendarProps {
  onClose: () => void;
}

interface Booking {
  date: string;
  time: string;
  service: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  total: number;
}

interface Service {
  id: string;
  name: string;
  price: number;
  description: string;
}

const services = [
  { id: 'recording', name: 'Recording Session', price: 75, description: 'Professional recording with engineer' },
  { id: 'mixing', name: 'Mixing Session', price: 60, description: 'Professional mixing and production' },
  { id: 'rehearsal', name: 'Rehearsal Space', price: 45, description: 'Band practice and rehearsal' }
];

const timeSlots = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
  '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
];

const BookingCalendar: React.FC<BookingCalendarProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [isFullDay, setIsFullDay] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock data for demonstration
  const bookedSlots = ['10:00', '14:00', '18:00'];
  const availableDates = ['2024-06-10', '2024-06-11', '2024-06-12', '2024-06-13', '2024-06-15'];

  const generateCalendarDays = () => {
    const today = new Date();
    const days = [];
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      const hasBookings = availableDates.includes(dateString);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      
      days.push({
        date: dateString,
        day: date.getDate(),
        isToday: i === 0,
        hasAvailableSlots: hasBookings,
        isWeekend
      });
    }
    
    return days;
  };

  const handleSlotToggle = (slot: string) => {
    if (selectedSlots.includes(slot)) {
      setSelectedSlots(selectedSlots.filter(s => s !== slot));
    } else if (selectedSlots.length < 4) {
      setSelectedSlots([...selectedSlots, slot]);
    } else {
      toast({
        title: "Maximum slots reached",
        description: "You can book up to 4 time slots per session.",
        variant: "destructive"
      });
    }
  };

  const handleFullDayToggle = () => {
    setIsFullDay(!isFullDay);
    if (!isFullDay) {
      setSelectedSlots(timeSlots.filter(slot => !bookedSlots.includes(slot)));
    } else {
      setSelectedSlots([]);
    }
  };

  const calculateTotal = () => {
    const service = services.find(s => s.id === selectedService);
    if (!service) return 0;
    
    if (isFullDay) {
      return service.price * 8; // 8 hour day rate
    }
    
    return service.price * selectedSlots.length;
  };

  const handleNext = () => {
    if (currentStep === 1 && selectedDate && selectedService && (selectedSlots.length > 0 || isFullDay)) {
      setCurrentStep(2);
    } else if (currentStep === 2 && customerInfo.name && customerInfo.email) {
      setCurrentStep(3);
    }
  };

  const handleBooking = () => {
    setIsLoading(true);
    
    // Simulate booking process
    setTimeout(() => {
      // Here you would integrate with Stripe
      // Example: Create Stripe checkout session
      // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      // const session = await stripe.checkout.sessions.create({...});
      
      toast({
        title: "Booking Confirmed!",
        description: `Your ${isFullDay ? 'full day' : selectedSlots.length + ' hour'} session has been booked for ${selectedDate}.`,
      });
      
      setIsLoading(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step <= currentStep ? 'bg-primary text-black' : 'bg-white/10 text-gray-400'
            }`}>
              {step}
            </div>
            {step < 3 && (
              <div className={`w-16 h-0.5 mx-2 ${
                step < currentStep ? 'bg-primary' : 'bg-white/10'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Date, Service & Time Selection */}
      {currentStep === 1 && (
        <div className="space-y-6">
          {/* Service Selection */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Select Service</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {services.map((service) => (
                  <Card 
                    key={service.id}
                    className={`cursor-pointer transition-all ${
                      selectedService === service.id 
                        ? 'bg-primary/20 border-primary' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                    onClick={() => setSelectedService(service.id)}
                  >
                    <CardHeader>
                      <CardTitle className="text-white text-lg">{service.name}</CardTitle>
                      <div className="text-2xl font-bold text-primary">${service.price}/hr</div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 text-sm">{service.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Date Selection */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Select Date</CardTitle>
              <CardDescription className="text-gray-300">
                Dates with available slots are highlighted
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {generateCalendarDays().map((day) => (
                  <Button
                    key={day.date}
                    variant={selectedDate === day.date ? "default" : "outline"}
                    className={`h-12 p-2 text-sm ${
                      selectedDate === day.date
                        ? 'bg-primary text-black hover:bg-primary/90'
                        : day.hasAvailableSlots
                        ? 'border-white/20 text-white hover:bg-white/10 hover:border-white/40'
                        : 'border-white/10 text-gray-500 cursor-not-allowed hover:bg-transparent'
                    } ${day.isToday ? 'ring-2 ring-primary/50' : ''}`}
                    onClick={() => day.hasAvailableSlots && setSelectedDate(day.date)}
                    disabled={!day.hasAvailableSlots}
                  >
                    <div className="flex flex-col">
                      <span>{day.day}</span>
                      {day.hasAvailableSlots && (
                        <div className="w-1 h-1 bg-green-400 rounded-full mx-auto mt-1" />
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Time Selection */}
          {selectedDate && (
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Select Time Slots</CardTitle>
                <CardDescription className="text-gray-300">
                  Choose up to 4 individual slots or book the full day
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Full Day Option */}
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div>
                    <h4 className="text-white font-semibold">Full Day (8 hours)</h4>
                    <p className="text-gray-300 text-sm">9:00 AM - 5:00 PM (excluding booked slots)</p>
                  </div>
                  <Button
                    variant={isFullDay ? "default" : "outline"}
                    onClick={handleFullDayToggle}
                    className={isFullDay 
                      ? "bg-primary text-black hover:bg-primary/90" 
                      : "border-white/20 text-white hover:bg-white/10 hover:border-white/40"
                    }
                  >
                    {isFullDay ? 'Selected' : 'Select Full Day'}
                  </Button>
                </div>

                {/* Individual Time Slots */}
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot}
                      variant={selectedSlots.includes(slot) ? "default" : "outline"}
                      className={`h-12 ${
                        bookedSlots.includes(slot)
                          ? 'border-red-500/50 text-red-400 cursor-not-allowed hover:bg-transparent'
                          : selectedSlots.includes(slot)
                          ? 'bg-primary text-black hover:bg-primary/90'
                          : 'border-white/20 text-white hover:bg-white/10 hover:border-white/40'
                      }`}
                      onClick={() => !bookedSlots.includes(slot) && !isFullDay && handleSlotToggle(slot)}
                      disabled={bookedSlots.includes(slot) || isFullDay}
                    >
                      {slot}
                      {bookedSlots.includes(slot) && (
                        <div className="ml-1 text-xs">(Booked)</div>
                      )}
                    </Button>
                  ))}
                </div>

                {/* Selected Summary */}
                {(selectedSlots.length > 0 || isFullDay) && (
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Booking Summary</h4>
                    <p className="text-gray-300">
                      {isFullDay 
                        ? `Full Day Session (8 hours) - $${calculateTotal()}`
                        : `${selectedSlots.length} hour${selectedSlots.length > 1 ? 's' : ''} - $${calculateTotal()}`
                      }
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end">
            <Button
              onClick={handleNext}
              disabled={!selectedDate || !selectedService || (selectedSlots.length === 0 && !isFullDay)}
              className="bg-primary hover:bg-primary/90 text-black font-semibold px-8"
            >
              Continue to Details
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Customer Information */}
      {currentStep === 2 && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Your Information</CardTitle>
            <CardDescription className="text-gray-300">
              Please provide your contact details for the booking
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-white">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-primary"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-white">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-primary"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="phone" className="text-white">Phone Number</Label>
              <Input
                id="phone"
                placeholder="Enter your phone number"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-primary"
              />
            </div>
            
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(1)}
                className="border-white/20 text-white hover:bg-white/10 hover:border-white/40"
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={!customerInfo.name || !customerInfo.email}
                className="bg-primary hover:bg-primary/90 text-black font-semibold px-8"
              >
                Proceed to Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Payment */}
      {currentStep === 3 && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Confirm & Pay</CardTitle>
            <CardDescription className="text-gray-300">
              Review your booking details and complete payment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Booking Summary */}
            <div className="p-4 bg-white/5 rounded-lg">
              <h4 className="text-white font-semibold mb-3">Booking Summary</h4>
              <div className="space-y-2 text-gray-300">
                <p><strong>Service:</strong> {services.find(s => s.id === selectedService)?.name}</p>
                <p><strong>Date:</strong> {selectedDate}</p>
                <p><strong>Duration:</strong> {isFullDay ? 'Full Day (8 hours)' : `${selectedSlots.length} hour(s)`}</p>
                <p><strong>Time:</strong> {isFullDay ? '9:00 AM - 5:00 PM' : selectedSlots.join(', ')}</p>
                <p><strong>Customer:</strong> {customerInfo.name} ({customerInfo.email})</p>
              </div>
              <div className="border-t border-white/10 mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">Total Amount:</span>
                  <span className="text-2xl font-bold text-primary">${calculateTotal()}</span>
                </div>
              </div>
            </div>

            {/* Stripe Integration Point */}
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center space-x-2 text-blue-400 mb-2">
                <CreditCard className="h-5 w-5" />
                <span className="font-semibold">Stripe Integration Point</span>
              </div>
              <p className="text-gray-300 text-sm">
                This is where you would integrate Stripe Elements or Checkout.
                For demo purposes, clicking "Confirm Booking" will simulate a successful payment.
              </p>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(2)}
                className="border-white/20 text-white hover:bg-white/10 hover:border-white/40"
              >
                Back
              </Button>
              <Button
                onClick={handleBooking}
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90 text-black font-semibold px-8"
              >
                {isLoading ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Confirm Booking
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BookingCalendar;
