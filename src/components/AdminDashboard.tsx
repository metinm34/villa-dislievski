import React, { useState, useEffect } from 'react';
import { Booking, BookingStatus, AdminStats, AdminUser, Room } from '../types';
import { 
  Users, Calendar, DollarSign, BedDouble, CheckCircle2, Clock, 
  XCircle, Search, RefreshCw, Plus, Download, Trash2, Eye, 
  ShieldCheck, LogOut, ExternalLink, Filter, Sparkles, Coffee, 
  Plane, Droplets, Wine, Check, ArrowUpDown 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminDashboardProps {
  currentUser: AdminUser;
  token: string;
  onLogout: () => void;
  onViewGuestSite: () => void;
  rooms: Room[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  token,
  onLogout,
  onViewGuestSite,
  rooms,
}) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'confirmed' | 'checked-in' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookingDetails, setSelectedBookingDetails] = useState<Booking | null>(null);
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

  // Manual Booking Form State
  const [manualForm, setManualForm] = useState({
    guestName: '',
    email: '',
    phone: '',
    country: 'International VIP',
    roomId: rooms[0]?.id || 'vd-royal-suite',
    roomName: rooms[0]?.name || 'The Royal Ohrid Suite',
    checkIn: '2026-09-15',
    checkOut: '2026-09-18',
    nights: 3,
    adultsCount: 2,
    childrenCount: 0,
    basePricePerNight: 280,
    status: 'confirmed',
    specialRequests: '',
  });

  // Fetch Bookings & Stats from server
  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch bookings
      const bookRes = await fetch('/api/admin/bookings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const bookData = await bookRes.json();
      if (bookData.success) {
        setBookings(bookData.bookings);
      }

      // 2. Fetch stats
      const statsRes = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.stats);
      }
    } catch (err) {
      console.error('Error fetching admin dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [token]);

  // Update Status Handler
  const handleUpdateStatus = async (id: string, newStatus: BookingStatus) => {
    setStatusUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
        );
        if (selectedBookingDetails && selectedBookingDetails.id === id) {
          setSelectedBookingDetails({ ...selectedBookingDetails, status: newStatus });
        }
        // Refresh stats
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Failed to update booking status:', err);
    } finally {
      setStatusUpdatingId(null);
    }
  };

  // Delete Booking Handler
  const handleDeleteBooking = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently remove this reservation?')) return;

    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setBookings((prev) => prev.filter((b) => b.id !== id));
        if (selectedBookingDetails?.id === id) setSelectedBookingDetails(null);
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Failed to delete booking:', err);
    }
  };

  // Create Manual Booking
  const handleCreateManualBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedRoom = rooms.find((r) => r.id === manualForm.roomId);
      const res = await fetch('/api/admin/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...manualForm,
          roomName: selectedRoom ? selectedRoom.name : manualForm.roomName,
          basePricePerNight: selectedRoom ? selectedRoom.pricePerNight : manualForm.basePricePerNight,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsNewBookingModalOpen(false);
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Failed to create manual booking:', err);
    }
  };

  // Export Bookings CSV
  const handleExportCSV = () => {
    const headers = 'Reference,Guest Name,Email,Phone,Country,Suite,Check-In,Check-Out,Nights,Guests,Total (EUR),Status\n';
    const rows = bookings.map((b) => 
      `"${b.bookingReference}","${b.guestName}","${b.email}","${b.phone || ''}","${b.country}","${b.roomName}","${b.checkIn}","${b.checkOut}",${b.nights},${b.adultsCount + b.childrenCount},${b.totalPrice},"${b.status}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `villa-dislievski-reservations-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter & Search Logic
  const filteredBookings = bookings.filter((b) => {
    const matchesFilter = activeFilter === 'all' || b.status === activeFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      b.guestName.toLowerCase().includes(query) ||
      b.email.toLowerCase().includes(query) ||
      b.bookingReference.toLowerCase().includes(query) ||
      b.roomName.toLowerCase().includes(query) ||
      b.country.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

  const filterTabs = [
    { id: 'all', label: 'All Reservations', count: bookings.length },
    { id: 'pending', label: 'Pending Action', count: bookings.filter((b) => b.status === 'pending').length },
    { id: 'confirmed', label: 'Confirmed VIP', count: bookings.filter((b) => b.status === 'confirmed').length },
    { id: 'checked-in', label: 'Checked In', count: bookings.filter((b) => b.status === 'checked-in').length },
    { id: 'cancelled', label: 'Cancelled', count: bookings.filter((b) => b.status === 'cancelled').length },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#E6D5B8] pt-24 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Top Header Bar */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 rounded-2xl bg-[#141418] border border-[#E6D5B8]/20 shadow-2xl">
          
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-[#2A2318] border border-[#E6D5B8]/40 flex items-center justify-center text-[#E6D5B8] shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif-luxury text-xl font-bold text-white tracking-wide">
                  DISLIEVSKI GUEST DASHBOARD
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-[#A19A8C]">
                Logged in as <span className="text-[#E6D5B8] font-medium">{currentUser.name}</span> ({currentUser.email})
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onViewGuestSite}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#1C1B20] text-[#D5C9B3] hover:text-white border border-[#E6D5B8]/15 hover:border-[#E6D5B8]/40 transition-colors flex items-center space-x-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Guest View</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#1C1B20] text-[#D5C9B3] hover:text-white border border-[#E6D5B8]/15 hover:border-[#E6D5B8]/40 transition-colors flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => setIsNewBookingModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-bold bg-[#E6D5B8] text-[#0F0F11] hover:bg-white transition-all flex items-center space-x-1.5 shadow-md"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>New Reservation</span>
            </button>

            <button
              onClick={onLogout}
              className="px-3 py-2 rounded-xl text-xs text-red-300 bg-red-950/30 hover:bg-red-900/40 border border-red-500/30 transition-colors flex items-center space-x-1"
              title="Sign out of Admin Session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">

        {/* KPI Metrics Cards */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Metric 1: Total Revenue */}
            <div className="p-5 rounded-2xl bg-[#141418] border border-[#E6D5B8]/15 shadow-xl flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-[#A19A8C] mb-2">
                <span className="uppercase tracking-wider">Total Revenue</span>
                <DollarSign className="w-4 h-4 text-[#E6D5B8]" />
              </div>
              <div className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white">
                €{stats.totalRevenue.toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-400 mt-1 flex items-center space-x-1">
                <span>Direct bookings ADR: €{stats.averageDailyRate}</span>
              </div>
            </div>

            {/* Metric 2: Total Bookings */}
            <div className="p-5 rounded-2xl bg-[#141418] border border-[#E6D5B8]/15 shadow-xl flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-[#A19A8C] mb-2">
                <span className="uppercase tracking-wider">Total Bookings</span>
                <BedDouble className="w-4 h-4 text-[#E6D5B8]" />
              </div>
              <div className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white">
                {stats.totalBookings}
              </div>
              <div className="text-[11px] text-[#A19A8C] mt-1">
                {stats.confirmedBookings} Confirmed · {stats.pendingBookings} Pending
              </div>
            </div>

            {/* Metric 3: Occupancy Rate */}
            <div className="p-5 rounded-2xl bg-[#141418] border border-[#E6D5B8]/15 shadow-xl flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-[#A19A8C] mb-2">
                <span className="uppercase tracking-wider">Lakefront Occupancy</span>
                <Users className="w-4 h-4 text-[#E6D5B8]" />
              </div>
              <div className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#E6D5B8]">
                {stats.occupancyRate}%
              </div>
              <div className="text-[11px] text-emerald-400 mt-1">
                High Season Peak Forecast
              </div>
            </div>

            {/* Metric 4: Average Stay */}
            <div className="p-5 rounded-2xl bg-[#141418] border border-[#E6D5B8]/15 shadow-xl flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-[#A19A8C] mb-2">
                <span className="uppercase tracking-wider">Avg Length of Stay</span>
                <Clock className="w-4 h-4 text-[#E6D5B8]" />
              </div>
              <div className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white">
                {stats.averageStayNights} <span className="text-sm font-normal text-[#A19A8C]">Nights</span>
              </div>
              <div className="text-[11px] text-[#A19A8C] mt-1">
                Luxury boutique leisure average
              </div>
            </div>

          </div>
        )}

        {/* Filter Tabs & Search Bar with Animated Indicator Bar */}
        <div className="rounded-2xl bg-[#141418] border border-[#E6D5B8]/20 p-5 shadow-2xl space-y-4">
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            
            {/* ANIMATED FILTER TABS WITH INDICATOR BAR */}
            <div className="flex items-center space-x-1 p-1 rounded-xl bg-[#0F0F12] border border-[#E6D5B8]/15 overflow-x-auto">
              {filterTabs.map((tab) => {
                const isActive = activeFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFilter(tab.id as any)}
                    className={`relative px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                      isActive ? 'text-[#0F0F11]' : 'text-[#A19A8C] hover:text-[#E6D5B8]'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="adminFilterIndicator"
                        className="absolute inset-0 bg-[#E6D5B8] rounded-lg shadow-sm"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                    <span className={`relative z-10 text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-[#0F0F11]/20 text-[#0F0F11]' : 'bg-[#1F1F24] text-[#D5C9B3]'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-72">
              <Search className="w-4 h-4 text-[#A19A8C] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search guest, ref, suite..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0F0F12] border border-[#E6D5B8]/15 text-xs text-white placeholder-[#68635B] focus:outline-none focus:border-[#E6D5B8]"
              />
            </div>

          </div>

          {/* PROTECTED GUEST DASHBOARD ANIMATED TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E6D5B8]/15 text-[#A19A8C] uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4 font-semibold">Ref & Guest</th>
                  <th className="py-3.5 px-4 font-semibold">Reserved Suite</th>
                  <th className="py-3.5 px-4 font-semibold">Check-In / Out</th>
                  <th className="py-3.5 px-4 font-semibold">Stay & Guests</th>
                  <th className="py-3.5 px-4 font-semibold">Price Calculation</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6D5B8]/10 text-[#D5C9B3]">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#A19A8C]">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#E6D5B8]" />
                      <span>Synchronizing reservations database...</span>
                    </td>
                  </tr>
                ) : filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#A19A8C]">
                      No reservations match your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => {
                    const isUpdating = statusUpdatingId === b.id;
                    return (
                      <tr 
                        key={b.id} 
                        className="hover:bg-[#1C1B20]/60 transition-colors group"
                      >
                        {/* Ref & Guest */}
                        <td className="py-4 px-4">
                          <div className="font-mono font-bold text-[#E6D5B8] text-[11px]">
                            {b.bookingReference}
                          </div>
                          <div className="font-semibold text-white mt-0.5">
                            {b.guestName}
                          </div>
                          <div className="text-[10px] text-[#A19A8C]">
                            {b.country} • {b.email}
                          </div>
                        </td>

                        {/* Suite Name */}
                        <td className="py-4 px-4">
                          <div className="font-serif-luxury font-medium text-white">
                            {b.roomName}
                          </div>
                          {/* Add-ons mini badges */}
                          <div className="flex flex-wrap gap-1 mt-1">
                            {b.addOns?.breakfast && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] bg-[#221F1B] text-[#E6D5B8] border border-[#E6D5B8]/20">
                                Breakfast
                              </span>
                            )}
                            {b.addOns?.lakeViewGuaranteed && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] bg-[#16222F] text-sky-300 border border-sky-500/20">
                                Lakeview
                              </span>
                            )}
                            {b.addOns?.spaAccess && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] bg-[#201726] text-purple-300 border border-purple-500/20">
                                Spa Pass
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Dates */}
                        <td className="py-4 px-4">
                          <div className="text-white font-medium">
                            {b.checkIn}
                          </div>
                          <div className="text-[10px] text-[#A19A8C]">
                            to {b.checkOut}
                          </div>
                        </td>

                        {/* Stay & Guest count */}
                        <td className="py-4 px-4">
                          <span className="font-semibold text-white">{b.nights} Nights</span>
                          <div className="text-[10px] text-[#A19A8C]">
                            {b.adultsCount} Adults{b.childrenCount > 0 ? `, ${b.childrenCount} Ch` : ''}
                          </div>
                        </td>

                        {/* Calculated Total */}
                        <td className="py-4 px-4">
                          <div className="font-serif-luxury font-bold text-[#E6D5B8] text-sm">
                            €{b.totalPrice?.toLocaleString()}
                          </div>
                          <div className="text-[10px] capitalize text-[#A19A8C]">
                            {b.paymentStatus.replace(/_/g, ' ')}
                          </div>
                        </td>

                        {/* Status Switcher Dropdown */}
                        <td className="py-4 px-4">
                          <select
                            disabled={isUpdating}
                            value={b.status}
                            onChange={(e) => handleUpdateStatus(b.id, e.target.value as BookingStatus)}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide border focus:outline-none cursor-pointer ${
                              b.status === 'confirmed'
                                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                                : b.status === 'pending'
                                ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                                : b.status === 'checked-in'
                                ? 'bg-sky-950/60 text-sky-300 border-sky-500/40'
                                : 'bg-red-950/60 text-red-300 border-red-500/40'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="checked-in">Checked-In</option>
                            <option value="checked-out">Checked-Out</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => setSelectedBookingDetails(b)}
                              className="p-1.5 rounded-lg bg-[#222127] text-[#E6D5B8] hover:bg-[#E6D5B8] hover:text-[#0F0F11] transition-colors"
                              title="View Guest Dossier & Requests"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteBooking(b.id)}
                              className="p-1.5 rounded-lg bg-[#222127] text-red-400 hover:bg-red-900 hover:text-white transition-colors"
                              title="Delete Reservation"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>

      {/* Guest Details Modal */}
      <AnimatePresence>
        {selectedBookingDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="relative w-full max-w-xl rounded-2xl bg-[#16161A] border border-[#E6D5B8]/30 p-6 sm:p-8 shadow-2xl"
            >
              <button
                onClick={() => setSelectedBookingDetails(null)}
                className="absolute top-4 right-4 p-2 rounded-full text-[#A19A8C] hover:text-white"
              >
                ✕
              </button>

              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#2A2318] border border-[#E6D5B8] flex items-center justify-center text-[#E6D5B8]">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#E6D5B8]">
                    Guest Dossier
                  </span>
                  <h3 className="text-xl font-serif-luxury font-bold text-white">
                    {selectedBookingDetails.guestName}
                  </h3>
                </div>
              </div>

              <div className="space-y-3 text-xs mb-6">
                <div className="p-3 rounded-xl bg-[#101013] border border-[#E6D5B8]/15 grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[#A19A8C] block text-[10px]">Reference</span>
                    <span className="font-mono font-bold text-[#E6D5B8]">{selectedBookingDetails.bookingReference}</span>
                  </div>
                  <div>
                    <span className="text-[#A19A8C] block text-[10px]">Email</span>
                    <span className="text-white">{selectedBookingDetails.email}</span>
                  </div>
                  <div>
                    <span className="text-[#A19A8C] block text-[10px]">Phone</span>
                    <span className="text-white">{selectedBookingDetails.phone || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-[#A19A8C] block text-[10px]">Origin Country</span>
                    <span className="text-white">{selectedBookingDetails.country}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#101013] border border-[#E6D5B8]/15">
                  <span className="text-[#A19A8C] block text-[10px] mb-1">Special Concierge Requests</span>
                  <p className="text-white font-serif-luxury italic">
                    "{selectedBookingDetails.specialRequests || 'No special requests requested. Standard 5-star VIP treatment.'}"
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#101013] border border-[#E6D5B8]/15 grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[#A19A8C] block text-[10px]">Suite & Stay</span>
                    <span className="text-white font-medium">{selectedBookingDetails.roomName} ({selectedBookingDetails.nights} nights)</span>
                  </div>
                  <div>
                    <span className="text-[#A19A8C] block text-[10px]">Total Revenue</span>
                    <span className="text-[#E6D5B8] font-bold text-sm">€{selectedBookingDetails.totalPrice}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleUpdateStatus(selectedBookingDetails.id, 'confirmed');
                    setSelectedBookingDetails(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold bg-emerald-700 text-white hover:bg-emerald-600 transition-colors"
                >
                  Mark Confirmed
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedBookingDetails(null)}
                  className="px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold bg-[#222127] text-[#D5C9B3] hover:text-white"
                >
                  Close
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Manual Booking Modal */}
      <AnimatePresence>
        {isNewBookingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="relative w-full max-w-lg rounded-2xl bg-[#16161A] border border-[#E6D5B8]/30 p-6 sm:p-8 shadow-2xl"
            >
              <button
                onClick={() => setIsNewBookingModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full text-[#A19A8C] hover:text-white"
              >
                ✕
              </button>

              <h3 className="text-xl font-serif-luxury font-bold text-white mb-1">
                MANUAL VIP RESERVATION
              </h3>
              <p className="text-xs text-[#A19A8C] mb-4">
                Log a direct concierge booking into Villa Dislievski database
              </p>

              <form onSubmit={handleCreateManualBooking} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[#A19A8C] text-[10px] uppercase mb-1">Guest Full Name *</label>
                  <input
                    type="text"
                    required
                    value={manualForm.guestName}
                    onChange={(e) => setManualForm({ ...manualForm, guestName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#101013] border border-[#E6D5B8]/20 text-white focus:outline-none focus:border-[#E6D5B8]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[#A19A8C] text-[10px] uppercase mb-1">Email</label>
                    <input
                      type="email"
                      value={manualForm.email}
                      onChange={(e) => setManualForm({ ...manualForm, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#101013] border border-[#E6D5B8]/20 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[#A19A8C] text-[10px] uppercase mb-1">Phone</label>
                    <input
                      type="tel"
                      value={manualForm.phone}
                      onChange={(e) => setManualForm({ ...manualForm, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#101013] border border-[#E6D5B8]/20 text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#A19A8C] text-[10px] uppercase mb-1">Suite</label>
                  <select
                    value={manualForm.roomId}
                    onChange={(e) => setManualForm({ ...manualForm, roomId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#101013] border border-[#E6D5B8]/20 text-white focus:outline-none"
                  >
                    {rooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} (€{r.pricePerNight}/nt)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[#A19A8C] text-[10px] uppercase mb-1">Check-In</label>
                    <input
                      type="date"
                      value={manualForm.checkIn}
                      onChange={(e) => setManualForm({ ...manualForm, checkIn: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#101013] border border-[#E6D5B8]/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[#A19A8C] text-[10px] uppercase mb-1">Check-Out</label>
                    <input
                      type="date"
                      value={manualForm.checkOut}
                      onChange={(e) => setManualForm({ ...manualForm, checkOut: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#101013] border border-[#E6D5B8]/20 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#A19A8C] text-[10px] uppercase mb-1">Special Concierge Instructions</label>
                  <textarea
                    rows={2}
                    value={manualForm.specialRequests}
                    onChange={(e) => setManualForm({ ...manualForm, specialRequests: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#101013] border border-[#E6D5B8]/20 text-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-full text-xs uppercase tracking-widest font-bold bg-[#E6D5B8] text-[#0F0F11] hover:bg-white transition-all mt-2"
                >
                  Create Reservation
                </button>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
