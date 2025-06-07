import { useState, useEffect } from 'react';
import { Calendar, Clock, Music, Users, Star, MapPin, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import BookingCalendar from '@/components/BookingCalendar';
import AdminPanel from '@/components/AdminPanel';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [showBooking, setShowBooking] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const { toast } = useToast();

  const studioFeatures = [
    {
      icon: <Music className="h-8 w-8 text-primary" />,
      title: "Professional Equipment",
      description: "State-of-the-art recording gear and instruments"
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Expert Engineers",
      description: "Experienced sound engineers and producers"
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "Flexible Hours",
      description: "Book hourly sessions that fit your schedule"
    },
    {
      icon: <Star className="h-8 w-8 text-primary" />,
      title: "Premium Quality",
      description: "Industry-standard acoustics and monitoring"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Singer-Songwriter",
      content: "The booking system is so easy to use, and the studio quality is incredible!",
      rating: 5
    },
    {
      name: "Mike Rodriguez",
      role: "Band Leader",
      content: "Perfect for our rehearsals. The hourly booking flexibility is exactly what we needed.",
      rating: 5
    },
    {
      name: "Emily Chen",
      role: "Producer",
      content: "Professional setup and seamless booking experience. Highly recommended!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Music className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-white">SoundStudio Pro</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => setShowBooking(true)}
                className="text-white hover:text-primary transition-colors"
              >
                Book Now
              </button>
              <button 
                onClick={() => setShowAdmin(true)}
                className="text-white hover:text-primary transition-colors"
              >
                Admin
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10" />
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
        
        <div className="container mx-auto px-4 z-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Book Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-400"> Dream Session</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Professional recording studio with hourly booking. State-of-the-art equipment, 
              perfect acoustics, and seamless scheduling.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => setShowBooking(true)}
                className="bg-primary hover:bg-primary/90 text-black font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Book Studio Time
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-4 rounded-lg transition-all duration-300"
              >
                <Music className="mr-2 h-5 w-5" />
                View Gallery
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-white mb-4">Why Choose SoundStudio Pro?</h3>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need for professional recording in one place
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {studioFeatures.map((feature, index) => (
              <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-primary/20 rounded-full w-fit">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-white mb-4">Transparent Pricing</h3>
            <p className="text-xl text-gray-300">Professional studio time at competitive rates</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white text-center">Recording</CardTitle>
                <div className="text-center">
                  <span className="text-4xl font-bold text-primary">$75</span>
                  <span className="text-gray-300">/hour</span>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-300">Professional recording with engineer</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 ring-2 ring-primary">
              <CardHeader>
                <CardTitle className="text-white text-center">Mixing</CardTitle>
                <div className="text-center">
                  <span className="text-4xl font-bold text-primary">$60</span>
                  <span className="text-gray-300">/hour</span>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-300">Professional mixing and production</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white text-center">Rehearsal</CardTitle>
                <div className="text-center">
                  <span className="text-4xl font-bold text-primary">$45</span>
                  <span className="text-gray-300">/hour</span>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-300">Band practice and rehearsal space</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-white mb-4">What Our Clients Say</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <CardTitle className="text-white text-sm">{testimonial.name}</CardTitle>
                  <CardDescription className="text-primary">{testimonial.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-4xl font-bold text-white mb-8">Get In Touch</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center justify-center space-x-2 text-gray-300">
                <MapPin className="h-5 w-5 text-primary" />
                <span>123 Music St, Sound City</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-gray-300">
                <Phone className="h-5 w-5 text-primary" />
                <span>(555) 123-MUSIC</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-gray-300">
                <Mail className="h-5 w-5 text-primary" />
                <span>book@soundstudiopro.com</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 border-t border-white/10 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Music className="h-6 w-6 text-primary" />
            <span className="text-white font-semibold">SoundStudio Pro</span>
          </div>
          <p className="text-gray-400">© 2024 SoundStudio Pro. All rights reserved.</p>
        </div>
      </footer>

      {/* Booking Modal */}
      {showBooking && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Book Your Session</h2>
              <Button 
                variant="ghost" 
                onClick={() => setShowBooking(false)}
                className="text-white hover:bg-white/10"
              >
                ✕
              </Button>
            </div>
            <div className="p-6">
              <BookingCalendar onClose={() => setShowBooking(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Admin Modal */}
      {showAdmin && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
              <Button 
                variant="ghost" 
                onClick={() => setShowAdmin(false)}
                className="text-white hover:bg-white/10"
              >
                ✕
              </Button>
            </div>
            <div className="p-6">
              <AdminPanel />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
