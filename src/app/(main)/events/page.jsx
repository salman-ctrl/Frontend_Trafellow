"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Nav";
import api from "@/lib/api";
import { getImageUrl } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Plus, 
  Search,
  Filter
} from "lucide-react";

export default function EventsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [events, setEvents] = useState([]);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    region_id: '',
    status: '',
    upcoming: 'true',
    page: 1,
    limit: 9
  });

  useEffect(() => {
    fetchRegions();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const fetchRegions = async () => {
    try {
      const { data } = await api.get('/regions');
      setRegions(data.data);
    } catch (error) {
      console.error('Error fetching regions:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (filters.region_id) params.append('region_id', filters.region_id);
      if (filters.status) params.append('status', filters.status);
      if (filters.upcoming) params.append('upcoming', filters.upcoming);
      params.append('page', filters.page);
      params.append('limit', filters.limit);

      const { data } = await api.get(`/events?${params.toString()}`);
      setEvents(data.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Gagal memuat event');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handleEventClick = (id) => {
    router.push(`/events/${id}`);
  };

  const handleCreateEvent = () => {
    if (!isAuthenticated) {
      toast.error('Silakan login terlebih dahulu');
      router.push('/login');
      return;
    }
    router.push('/events/create');
  };

  // Modern Badge Design
  const getStatusBadge = (status) => {
    const statusMap = {
      open: { 
        bg: 'bg-emerald-50', 
        text: 'text-emerald-700', 
        border: 'border-emerald-200',
        label: 'Open Trip' 
      },
      full: { 
        bg: 'bg-zinc-100', 
        text: 'text-zinc-600', 
        border: 'border-zinc-200',
        label: 'Fully Booked' 
      },
      ongoing: { 
        bg: 'bg-blue-50', 
        text: 'text-blue-700', 
        border: 'border-blue-200',
        label: 'Live Now' 
      },
      completed: { 
        bg: 'bg-gray-50', 
        text: 'text-gray-500', 
        border: 'border-gray-200',
        label: 'Selesai' 
      },
      cancelled: { 
        bg: 'bg-red-50', 
        text: 'text-red-700', 
        border: 'border-red-200',
        label: 'Dibatalkan' 
      }
    };
    
    const style = statusMap[status] || statusMap.open;
    
    return (
      <span className={`
        ${style.bg} ${style.text} ${style.border} 
        text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full border
      `}>
        {style.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />

      {/* Hero Section Simplified */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                Jelajahi Event Seru
              </h1>
              <p className="mt-3 text-lg text-gray-500 max-w-2xl">
                Temukan pengalaman wisata lokal yang autentik dan bergabunglah dengan komunitas traveler lainnya.
              </p>
            </div>
            
            <button
              onClick={handleCreateEvent}
              className="inline-flex items-center px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-all shadow-lg shadow-gray-900/10 hover:shadow-gray-900/20 transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5 mr-2" />
              Buat Event
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Modern Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-10 sticky top-20 z-10 backdrop-blur-md bg-white/80">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            
            {/* Filter Label */}
            <div className="hidden md:flex items-center text-gray-400 px-2">
              <Filter className="w-5 h-5" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
              {/* Region Select */}
              <div className="relative group">
                <select
                  value={filters.region_id}
                  onChange={(e) => handleFilterChange('region_id', e.target.value)}
                  className="w-full appearance-none bg-gray-50 hover:bg-gray-100 border border-transparent hover:border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-3 pr-8 focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all cursor-pointer"
                >
                  <option value="">Semua Destinasi</option>
                  {regions.map((region) => (
                    <option key={region.region_id} value={region.region_id}>
                      {region.name}
                    </option>
                  ))}
                </select>
                <MapPin className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Status Select */}
              <div className="relative">
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full appearance-none bg-gray-50 hover:bg-gray-100 border border-transparent hover:border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-3 pr-8 focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all cursor-pointer"
                >
                  <option value="">Status Event</option>
                  <option value="open">Masih Dibuka</option>
                  <option value="full">Penuh</option>
                  <option value="completed">Selesai</option>
                </select>
                <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Time Select */}
              <div className="relative">
                <select
                  value={filters.upcoming}
                  onChange={(e) => handleFilterChange('upcoming', e.target.value)}
                  className="w-full appearance-none bg-gray-50 hover:bg-gray-100 border border-transparent hover:border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-3 pr-8 focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all cursor-pointer"
                >
                  <option value="true">Akan Datang</option>
                  <option value="">Semua Waktu</option>
                </select>
                <Calendar className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Reset Button */}
              <button
                onClick={() => setFilters({ region_id: '', status: '', upcoming: 'true', page: 1, limit: 9 })}
                className="w-full text-gray-500 hover:text-gray-900 text-sm font-medium py-3 px-4 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Reset Filter
              </button>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-[400px] animate-pulse border border-gray-100"></div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Tidak ada event ditemukan</h3>
            <p className="text-gray-500 mt-2">Coba sesuaikan filter pencarian Anda</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => {
              const eventDate = new Date(event.event_date);
              const dateStr = eventDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
              
              return (
                <div
                  key={event.event_id}
                  onClick={() => handleEventClick(event.event_id)}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full"
                >
                  {/* Image Container with Overlay */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <img
                      src={getImageUrl(event.image)}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                    
                    <div className="absolute top-4 left-4">
                      {getStatusBadge(event.status)}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    {/* Meta Top */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                        <MapPin className="w-3 h-3 mr-1" />
                        {event.region_name}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {dateStr}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                      {event.title}
                    </h3>

                    {/* Divider */}
                    <div className="h-px w-full bg-gray-100 my-4"></div>

                    {/* Meta Bottom */}
                    <div className="flex items-center justify-between mt-auto text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
                        {event.event_time} WIB
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1.5 text-gray-400" />
                        <span className="font-medium text-gray-900">{event.current_participants}</span>
                        <span className="text-gray-400 mx-1">/</span>
                        <span>{event.max_participants} Slot</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Modern */}
        {events.length > 0 && (
          <div className="flex justify-center mt-16">
            <div className="inline-flex bg-white shadow-sm rounded-xl border border-gray-100 p-1">
              <button
                onClick={() => handleFilterChange('page', Math.max(1, filters.page - 1))}
                disabled={filters.page === 1}
                className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
              >
                Previous
              </button>
              <div className="px-4 py-2 text-sm font-medium text-gray-900 border-x border-gray-100">
                Page {filters.page}
              </div>
              <button
                onClick={() => handleFilterChange('page', filters.page + 1)}
                disabled={events.length < filters.limit}
                className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}