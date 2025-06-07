
import React, { useState, useEffect } from 'react';
import { Settings, DollarSign, Image, Calendar, Users, BarChart3, Upload, Trash2, Edit3, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface PricingItem {
  id: string;
  name: string;
  price: number;
  description: string;
}

interface StudioImage {
  id: string;
  url: string;
  alt: string;
  category: string;
}

interface Booking {
  id: string;
  date: string;
  time: string;
  service: string;
  customerName: string;
  customerEmail: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  amount: number;
}

const AdminPanel: React.FC = () => {
  const [pricing, setPricing] = useState<PricingItem[]>([
    { id: '1', name: 'Recording Session', price: 75, description: 'Professional recording with engineer' },
    { id: '2', name: 'Mixing Session', price: 60, description: 'Professional mixing and production' },
    { id: '3', name: 'Rehearsal Space', price: 45, description: 'Band practice and rehearsal' }
  ]);

  const [images, setImages] = useState<StudioImage[]>([
    { id: '1', url: '/api/placeholder/400/300', alt: 'Recording Studio Main Room', category: 'studio' },
    { id: '2', url: '/api/placeholder/400/300', alt: 'Mixing Console', category: 'equipment' },
    { id: '3', url: '/api/placeholder/400/300', alt: 'Vocal Booth', category: 'studio' },
    { id: '4', url: '/api/placeholder/400/300', alt: 'Rehearsal Room', category: 'studio' }
  ]);

  const [bookings, setBookings] = useState<Booking[]>([
    { id: '1', date: '2024-06-10', time: '14:00', service: 'Recording Session', customerName: 'John Doe', customerEmail: 'john@example.com', status: 'confirmed', amount: 150 },
    { id: '2', date: '2024-06-11', time: '16:00', service: 'Mixing Session', customerName: 'Jane Smith', customerEmail: 'jane@example.com', status: 'pending', amount: 120 },
    { id: '3', date: '2024-06-12', time: '10:00', service: 'Rehearsal Space', customerName: 'The Rockers', customerEmail: 'band@example.com', status: 'confirmed', amount: 90 }
  ]);

  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [newImage, setNewImage] = useState({ url: '', alt: '', category: 'studio' });
  const { toast } = useToast();

  const handlePriceUpdate = (id: string, updates: Partial<PricingItem>) => {
    setPricing(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
    setEditingPrice(null);
    toast({
      title: "Price Updated",
      description: "Pricing has been successfully updated.",
    });
  };

  const handleImageAdd = () => {
    if (!newImage.url || !newImage.alt) {
      toast({
        title: "Please fill all fields",
        description: "URL and alt text are required for new images.",
        variant: "destructive"
      });
      return;
    }

    const image: StudioImage = {
      id: Date.now().toString(),
      ...newImage
    };

    setImages(prev => [...prev, image]);
    setNewImage({ url: '', alt: '', category: 'studio' });
    toast({
      title: "Image Added",
      description: "New studio image has been added successfully.",
    });
  };

  const handleImageDelete = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
    toast({
      title: "Image Deleted",
      description: "Studio image has been removed.",
    });
  };

  const handleBookingStatusUpdate = (id: string, status: Booking['status']) => {
    setBookings(prev => prev.map(booking => 
      booking.id === id ? { ...booking, status } : booking
    ));
    toast({
      title: "Booking Updated",
      description: `Booking status changed to ${status}.`,
    });
  };

  const getTotalRevenue = () => {
    return bookings
      .filter(booking => booking.status === 'confirmed')
      .reduce((total, booking) => total + booking.amount, 0);
  };

  const getPendingBookings = () => {
    return bookings.filter(booking => booking.status === 'pending').length;
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${getTotalRevenue()}</div>
            <p className="text-xs text-gray-400">This month</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Confirmed Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {bookings.filter(b => b.status === 'confirmed').length}
            </div>
            <p className="text-xs text-gray-400">This week</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Pending Bookings</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{getPendingBookings()}</div>
            <p className="text-xs text-gray-400">Awaiting confirmation</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Studio Images</CardTitle>
            <Image className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{images.length}</div>
            <p className="text-xs text-gray-400">Gallery items</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pricing" className="space-y-6">
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger value="pricing" className="data-[state=active]:bg-primary data-[state=active]:text-black">
            <DollarSign className="mr-2 h-4 w-4" />
            Pricing
          </TabsTrigger>
          <TabsTrigger value="images" className="data-[state=active]:bg-primary data-[state=active]:text-black">
            <Image className="mr-2 h-4 w-4" />
            Gallery
          </TabsTrigger>
          <TabsTrigger value="bookings" className="data-[state=active]:bg-primary data-[state=active]:text-black">
            <Calendar className="mr-2 h-4 w-4" />
            Bookings
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-black">
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Pricing Management */}
        <TabsContent value="pricing" className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Service Pricing</CardTitle>
              <CardDescription className="text-gray-300">
                Manage hourly rates for different studio services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pricing.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  {editingPrice === item.id ? (
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        value={item.name}
                        onChange={(e) => setPricing(prev => prev.map(p => 
                          p.id === item.id ? { ...p, name: e.target.value } : p
                        ))}
                        className="bg-white/5 border-white/10 text-white"
                        placeholder="Service name"
                      />
                      <Input
                        type="number"
                        value={item.price}
                        onChange={(e) => setPricing(prev => prev.map(p => 
                          p.id === item.id ? { ...p, price: parseInt(e.target.value) } : p
                        ))}
                        className="bg-white/5 border-white/10 text-white"
                        placeholder="Price per hour"
                      />
                      <Input
                        value={item.description}
                        onChange={(e) => setPricing(prev => prev.map(p => 
                          p.id === item.id ? { ...p, description: e.target.value } : p
                        ))}
                        className="bg-white/5 border-white/10 text-white"
                        placeholder="Description"
                      />
                    </div>
                  ) : (
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-white font-semibold">{item.name}</h4>
                          <p className="text-gray-300 text-sm">{item.description}</p>
                        </div>
                        <div className="text-2xl font-bold text-primary">${item.price}/hr</div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {editingPrice === item.id ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handlePriceUpdate(item.id, item)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingPrice(null)}
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingPrice(item.id)}
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Image Management */}
        <TabsContent value="images" className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Studio Gallery</CardTitle>
              <CardDescription className="text-gray-300">
                Manage studio photos and media
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add New Image */}
              <div className="p-4 bg-white/5 rounded-lg">
                <h4 className="text-white font-semibold mb-4">Add New Image</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input
                    placeholder="Image URL"
                    value={newImage.url}
                    onChange={(e) => setNewImage(prev => ({ ...prev, url: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white"
                  />
                  <Input
                    placeholder="Alt text"
                    value={newImage.alt}
                    onChange={(e) => setNewImage(prev => ({ ...prev, alt: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white"
                  />
                  <select
                    value={newImage.category}
                    onChange={(e) => setNewImage(prev => ({ ...prev, category: e.target.value }))}
                    className="bg-white/5 border border-white/10 text-white rounded-md px-3 py-2"
                  >
                    <option value="studio">Studio</option>
                    <option value="equipment">Equipment</option>
                    <option value="artists">Artists</option>
                  </select>
                  <Button onClick={handleImageAdd} className="bg-primary hover:bg-primary/90 text-black">
                    <Upload className="mr-2 h-4 w-4" />
                    Add Image
                  </Button>
                </div>
              </div>

              {/* Image Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((image) => (
                  <div key={image.id} className="relative group">
                    <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=';
                        }}
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleImageDelete(image.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-2">
                      <p className="text-white text-sm font-medium">{image.alt}</p>
                      <p className="text-gray-400 text-xs capitalize">{image.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bookings Management */}
        <TabsContent value="bookings" className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Recent Bookings</CardTitle>
              <CardDescription className="text-gray-300">
                Manage customer bookings and payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h4 className="text-white font-semibold">{booking.service}</h4>
                            <p className="text-gray-300 text-sm">
                              {booking.customerName} • {booking.customerEmail}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-white">{booking.date} at {booking.time}</p>
                            <p className="text-primary font-semibold">${booking.amount}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          booking.status === 'confirmed' ? 'bg-green-600 text-white' :
                          booking.status === 'pending' ? 'bg-yellow-600 text-white' :
                          'bg-red-600 text-white'
                        }`}>
                          {booking.status}
                        </span>
                        {booking.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleBookingStatusUpdate(booking.id, 'confirmed')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Confirm
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleBookingStatusUpdate(booking.id, 'cancelled')}
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Revenue by Service</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pricing.map((service) => {
                    const serviceBookings = bookings.filter(b => 
                      b.service === service.name && b.status === 'confirmed'
                    );
                    const revenue = serviceBookings.reduce((sum, b) => sum + b.amount, 0);
                    const percentage = revenue > 0 ? (revenue / getTotalRevenue()) * 100 : 0;
                    
                    return (
                      <div key={service.id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white">{service.name}</span>
                          <span className="text-primary">${revenue}</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Booking Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['confirmed', 'pending', 'cancelled'].map((status) => {
                    const count = bookings.filter(b => b.status === status).length;
                    const percentage = count > 0 ? (count / bookings.length) * 100 : 0;
                    
                    return (
                      <div key={status}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white capitalize">{status}</span>
                          <span className="text-primary">{count}</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              status === 'confirmed' ? 'bg-green-500' :
                              status === 'pending' ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
