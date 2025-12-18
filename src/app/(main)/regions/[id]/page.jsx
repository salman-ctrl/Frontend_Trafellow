"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { getImageUrl } from '@/lib/utils';
import Navbar from '@/components/layout/Nav';
import toast from 'react-hot-toast';
import { 
  MapPin, Calendar, Users, Eye, ArrowLeft, 
  Grid, List, Navigation, Info, Heart
} from 'lucide-react';

const MapView = dynamic(() => import('@/components/Map/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-gray-100 animate-pulse rounded-2xl flex items-center justify-center">
      <div className="flex flex-col items-center text-gray-400">
        <MapPin className="w-8 h-8 mb-2 animate-bounce" />
        <p className="text-sm font-medium">Memuat peta lokasi...</p>
      </div>
    </div>
  )
});

export default function RegionDetail() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [region, setRegion] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    category_id: '',
    view: 'grid'
  });

  useEffect(() => {
    if (id) {
      fetchRegionData();
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchDestinations();
    }
  }, [id, filters.category_id]);

  const fetchRegionData = async () => {
    try {
      setLoading(true);

      const [regionRes, categoriesRes, eventsRes] = await Promise.all([
        api.get(`/regions/${id}`),
        api.get('/destination-categories'),
        api.get(`/events?region_id=${id}`)
      ]);

      setRegion(regionRes.data.data);
      setCategories(categoriesRes.data.data || []);
      setEvents(eventsRes.data.data?.slice(0, 3) || []);
    } catch (error) {
      console.error('Error fetching region:', error);
      toast.error('Gagal memuat data region');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchDestinations = async () => {
    try {
      const params = new URLSearchParams({
        region_id: id
      });

      if (filters.category_id) {
        params.append('category_id', filters.category_id);
      }

      const { data } = await api.get(`/destinations?${params}`);
      setDestinations(data.data || []);
    } catch (error) {
      console.error('Error fetching destinations:', error);
    }
  };

  const handleDestinationClick = (destinationId) => {
    router.push(`/destinations/${destinationId}`);
  };

  const handleEventClick = (eventId) => {
    router.push(`/events/${eventId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="h-[500px] bg-slate-200 animate-pulse"></div>
        <div className="max-w-7xl mx-auto px-4 -mt-32 relative z-10 pb-12">
          <div className="bg-white rounded-3xl p-8 shadow-xl h-64 animate-pulse mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-80 animate-pulse shadow-sm"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!region) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="relative h-[600px] overflow-hidden">
        {region.image ? (
          <img
            src={getImageUrl(region.image)}
            alt={region.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700"></div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-slate-900/90"></div>
        
        <div className="absolute inset-0 pt-24 pb-16 px-4">
          <div className="max-w-7xl mx-auto h-full flex flex-col justify-between">
            <button
              onClick={() => router.back()}
              className="w-fit flex items-center gap-2 text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-all backdrop-blur-sm"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Kembali</span>
            </button>
            
            <div className="space-y-6 animate-fade-in-up">
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-blue-900/20">
                  {region.type === 'kota' ? 'Kota' : 'Kabupaten'}
                </span>
                <span className="bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 border border-white/10">
                  <MapPin className="w-3.5 h-3.5" />
                  {destinations.length} Destinasi
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight drop-shadow-lg">
                {region.name}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10 pb-20 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                  <Info className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Tentang Wilayah</h2>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">
                {region.description}
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Destinasi Wisata</h2>
                  <p className="text-gray-500">Jelajahi tempat menarik di {region.name}</p>
                </div>
                
                <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, view: 'grid' }))}
                    className={`p-2 rounded-lg transition-all ${
                      filters.view === 'grid' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, view: 'list' }))}
                    className={`p-2 rounded-lg transition-all ${
                      filters.view === 'list' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="mb-8">
                <select
                  value={filters.category_id}
                  onChange={(e) => setFilters(prev => ({ ...prev, category_id: e.target.value }))}
                  className="w-full sm:w-64 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-medium cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <option value="">Semua Kategori</option>
                  {categories.map((category) => (
                    <option key={category.category_id} value={category.category_id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {destinations.length > 0 ? (
                <div className={filters.view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}>
                  {destinations.map((destination) => (
                    filters.view === 'grid' ? (
                      <div
                        key={destination.destination_id}
                        onClick={() => handleDestinationClick(destination.destination_id)}
                        className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
                      >
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={getImageUrl(destination.image)}
                            alt={destination.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          {destination.category_name && (
                            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm">
                              {destination.category_icon} {destination.category_name}
                            </span>
                          )}
                        </div>
                        <div className="p-5">
                          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                            {destination.name}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500 mb-4">
                            <MapPin className="w-4 h-4 mr-1.5 text-blue-500 shrink-0" />
                            <span className="truncate">{destination.address}</span>
                          </div>
                          <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                            <div className="flex items-center text-gray-400 text-sm">
                              <Eye className="w-4 h-4 mr-1.5" />
                              {destination.view_count || 0}
                            </div>
                            {destination.ticket_price > 0 && (
                              <span className="text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-lg text-sm">
                                Rp {Number(destination.ticket_price).toLocaleString('id-ID')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        key={destination.destination_id}
                        onClick={() => handleDestinationClick(destination.destination_id)}
                        className="group flex flex-col sm:flex-row bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-lg hover:border-blue-100 transition-all cursor-pointer"
                      >
                        <div className="w-full sm:w-40 h-40 sm:h-32 rounded-xl overflow-hidden shrink-0">
                          <img
                            src={getImageUrl(destination.image)}
                            alt={destination.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex-1 mt-4 sm:mt-0 sm:ml-6 flex flex-col justify-center">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{destination.name}</h3>
                              <p className="text-sm text-gray-500 flex items-center mt-1">
                                <MapPin className="w-3.5 h-3.5 mr-1" />
                                {destination.address}
                              </p>
                            </div>
                            {destination.ticket_price > 0 && (
                              <span className="hidden sm:inline-block text-blue-600 font-bold text-sm bg-blue-50 px-3 py-1 rounded-lg">
                                Rp {Number(destination.ticket_price).toLocaleString('id-ID')}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm line-clamp-2 mb-3">{destination.description}</p>
                          <div className="flex items-center gap-4 text-xs font-medium text-gray-500 mt-auto">
                            {destination.category_name && (
                              <span className="bg-gray-100 px-2 py-1 rounded-md text-gray-700">
                                {destination.category_icon} {destination.category_name}
                              </span>
                            )}
                            <span className="flex items-center">
                              <Eye className="w-3.5 h-3.5 mr-1" /> {destination.view_count || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">Belum ada destinasi ditemukan</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-1 shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-6 pb-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-blue-600" />
                  Peta Lokasi
                </h3>
              </div>
              <div className="h-[400px] w-full">
                {region.latitude && region.longitude ? (
                  <MapView
                    latitude={region.latitude}
                    longitude={region.longitude}
                    name={region.name}
                    zoom={11}
                    height="h-full"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center bg-gray-50 text-gray-400 text-sm">
                    Data lokasi tidak tersedia
                  </div>
                )}
              </div>
              <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${region.latitude},${region.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 text-sm font-semibold inline-flex items-center gap-1 hover:underline"
                >
                  Buka di Google Maps <ArrowLeft className="w-3 h-3 rotate-180" />
                </a>
              </div>
            </div>

            {events.length > 0 && (
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    Event Mendatang
                  </h3>
                  <button 
                    onClick={() => router.push(`/events?region_id=${id}`)}
                    className="text-xs font-semibold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-full transition-colors"
                  >
                    Lihat Semua
                  </button>
                </div>
                
                <div className="space-y-4">
                  {events.map((event) => {
                    const eventDate = new Date(event.event_date);
                    return (
                      <div
                        key={event.event_id}
                        onClick={() => handleEventClick(event.event_id)}
                        className="group flex gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100"
                      >
                        <div className="shrink-0 bg-blue-100 text-blue-700 w-14 h-14 rounded-xl flex flex-col items-center justify-center border border-blue-200">
                          <span className="text-xl font-bold leading-none">{eventDate.getDate()}</span>
                          <span className="text-[10px] uppercase font-bold mt-0.5">
                            {eventDate.toLocaleString('id-ID', { month: 'short' })}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                            {event.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {event.meeting_point}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              event.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {event.status === 'open' ? 'OPEN' : 'CLOSED'}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {event.current_participants}/{event.max_participants} joined
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}