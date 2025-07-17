import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Calendar, Clock, User, MapPin, Phone, Mail, CheckCircle, ArrowLeft, Plus, Edit, Trash2, Star, Filter, Search } from 'lucide-react';

const BookingSystem = () => {
  const [currentView, setCurrentView] = useState('home');
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([
    { id: 1, name: 'Hair Cut & Styling', duration: 60, price: 50, category: 'Hair', rating: 4.8, image: '💇' },
    { id: 2, name: 'Massage Therapy', duration: 90, price: 80, category: 'Wellness', rating: 4.9, image: '💆' },
    { id: 3, name: 'Dental Cleaning', duration: 45, price: 120, category: 'Health', rating: 4.7, image: '🦷' },
    { id: 4, name: 'Personal Training', duration: 60, price: 75, category: 'Fitness', rating: 4.8, image: '💪' },
    { id: 5, name: 'Photography Session', duration: 120, price: 200, category: 'Creative', rating: 4.9, image: '📸' },
    { id: 6, name: 'Consulting', duration: 60, price: 150, category: 'Business', rating: 4.6, image: '💼' }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  // Get available dates (next 30 days)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const handleBooking = (formData) => {
    const newBooking = {
      id: Date.now(),
      service: selectedService,
      date: selectedDate,
      time: selectedTime,
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };
    setBookings([...bookings, newBooking]);
    setCurrentView('confirmation');
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || service.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(services.map(s => s.category))];

  // Home Component
  const Home = ({ setCurrentView }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentView('auth'); // Redirect to login/register view
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                BookEase
              </h1>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8 items-center">
              <a href="#" className="text-gray-700 hover:text-purple-600 transition-colors">Services</a>
              <a href="#" className="text-gray-700 hover:text-purple-600 transition-colors">About</a>
              <a href="#" className="text-gray-700 hover:text-purple-600 transition-colors">Contact</a>

              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="font-medium text-gray-700">Welcome, {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-red-600"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setCurrentView('auth')}
                  className="bg-purple-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-purple-600"
                >
                  Login / Register
                </button>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            Book Your Perfect
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent block">
              Appointment
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Seamless scheduling for all your needs. From wellness to business, 
            find and book the perfect service in just a few clicks.
          </p>
          <button
            onClick={() => setCurrentView('services')}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-purple-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
          >
            Browse Services
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 text-center transform hover:scale-105 transition-all duration-300 shadow-xl">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Easy Scheduling</h3>
            <p className="text-gray-600">Book appointments in seconds with our intuitive calendar interface.</p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 text-center transform hover:scale-105 transition-all duration-300 shadow-xl">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Real-time Availability</h3>
            <p className="text-gray-600">See live availability and get instant confirmations.</p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 text-center transform hover:scale-105 transition-all duration-300 shadow-xl">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Manage Bookings</h3>
            <p className="text-gray-600">Track, modify, and manage all your appointments in one place.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
  // Services Component
  const Services = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center mb-8">
          <button
            onClick={() => setCurrentView('home')}
            className="mr-4 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-3xl font-bold text-gray-800">Our Services</h2>
        </div>

        {/* Search and Filter */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-xl">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="pl-10 pr-8 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(service => (
            <div key={service.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{service.image}</div>
                <h3 className="text-xl font-semibold text-gray-800">{service.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{service.category}</p>
                <div className="flex items-center justify-center mb-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">{service.rating}</span>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-semibold">{service.duration} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-semibold text-green-600">₹{service.price}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedService(service);
                  setCurrentView('booking');
                }}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300"
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Booking Component
  const Booking = () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      notes: ''
    });

    const handleSubmit = () => {
      if (!selectedDate || !selectedTime) {
        alert('Please select a date and time');
        return;
      }
      handleBooking(formData);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-6">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center mb-8">
            <button
              onClick={() => setCurrentView('services')}
              className="mr-4 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-3xl font-bold text-gray-800">Book Appointment</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Service Info */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-semibold mb-4">Service Details</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-3xl mr-3">{selectedService?.image}</span>
                  <div>
                    <h4 className="font-semibold">{selectedService?.name}</h4>
                    <p className="text-sm text-gray-600">{selectedService?.category}</p>
                  </div>
                </div>
                <div className="flex justify-between py-2 border-t">
                  <span>Duration:</span>
                  <span className="font-semibold">{selectedService?.duration} minutes</span>
                </div>
                <div className="flex justify-between py-2 border-t">
                  <span>Price:</span>
                  <span className="font-semibold text-green-600">₹{selectedService?.price}</span>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-semibold mb-4">Booking Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows="3"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>

          {/* Date and Time Selection */}
          <div className="grid lg:grid-cols-2 gap-8 mt-8">
            {/* Date Selection */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-semibold mb-4">Select Date</h3>
              <div className="grid grid-cols-3 gap-2">
                {getAvailableDates().slice(0, 15).map(date => {
                  const dateObj = new Date(date);
                  const isSelected = selectedDate === date;
                  return (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`p-3 rounded-xl text-center transition-all duration-300 ${
                        isSelected
                          ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="text-xs text-gray-600">{dateObj.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                      <div className="font-semibold">{dateObj.getDate()}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Selection */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-semibold mb-4">Select Time</h3>
              <div className="grid grid-cols-3 gap-2">
                {generateTimeSlots().map(time => {
                  const isSelected = selectedTime === time;
                  return (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-3 rounded-xl text-center transition-all duration-300 ${
                        isSelected
                          ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  //auth componet 
  const Auth = ({ authMode, setAuthMode }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const isLogin = authMode === 'login';

  const handleAuth = async () => {
    const endpoint = isLogin
      ? 'http://localhost:5000/api/auth/login'
      : 'http://localhost:5000/api/auth/register';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Auth error:', data);
        alert(data.message || data.errors?.[0]?.msg || 'Authentication failed');
        return;
      }

      // ✅ Store user and token
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // ✅ Redirect to home
      navigate('/');
       window.location.reload();

    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isLogin ? 'Login' : 'Register'}
        </h2>

        {!isLogin && (
          <>
            <input
              type="text"
              placeholder="Name"
              className="mb-3 w-full px-4 py-2 border rounded"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              type="tel"
              placeholder="Phone"
              className="mb-3 w-full px-4 py-2 border rounded"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </>
        )}

        <input
          type="email"
          placeholder="Email"
          className="mb-3 w-full px-4 py-2 border rounded"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="mb-3 w-full px-4 py-2 border rounded"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />

        <button
          onClick={handleAuth}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 rounded-lg font-semibold mb-4"
        >
          {isLogin ? 'Login' : 'Sign Up'}
        </button>

        <p className="text-center text-sm">
          {isLogin ? "Don't have an account?" : 'Already registered?'}{' '}
          <button
            className="text-purple-600 font-semibold underline"
            onClick={() => setAuthMode(isLogin ? 'register' : 'login')}
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};


  // Confirmation Component
  const Confirmation = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-6 flex items-center justify-center">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl max-w-md mx-auto text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Booking Confirmed!</h2>
        <p className="text-gray-600 mb-6">
          Your appointment has been successfully booked. You'll receive a confirmation email shortly.
        </p>
        <div className="space-y-2 mb-6 text-left">
          <div className="flex justify-between">
            <span className="text-gray-600">Service:</span>
            <span className="font-semibold">{selectedService?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-semibold">{selectedDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Time:</span>
            <span className="font-semibold">{selectedTime}</span>
          </div>
        </div>
        <div className="space-y-3">
          <button
            onClick={() => setCurrentView('services')}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300"
          >
            Book Another Service
          </button>
          <button
            onClick={() => setCurrentView('home')}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );

  // Render based on current view
  // Render based on current view
switch (currentView) {
  case 'auth':
    return <Auth authMode={authMode} setAuthMode={setAuthMode} />;

  case 'services':
    return <Services setCurrentView={setCurrentView} setSelectedService={setSelectedService} services={services} searchTerm={searchTerm} setSearchTerm={setSearchTerm} filterCategory={filterCategory} setFilterCategory={setFilterCategory} />;

  case 'booking':
    return <Booking
      selectedService={selectedService}
      selectedDate={selectedDate}
      setSelectedDate={setSelectedDate}
      selectedTime={selectedTime}
      setSelectedTime={setSelectedTime}
      handleBooking={handleBooking}
      setCurrentView={setCurrentView}
    />;

  case 'confirmation':
    return (
      <Confirmation
        selectedService={selectedService}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        setCurrentView={setCurrentView}
      />
    );

  default:
    return <Home setCurrentView={setCurrentView} />;
}

};

export default BookingSystem;