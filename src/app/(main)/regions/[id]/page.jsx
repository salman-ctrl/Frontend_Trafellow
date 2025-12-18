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
  Grid, List, Navigation, Info, ExternalLink,
  ChevronRight, Map as MapIcon
} from 'lucide-react';

const MapView = dynamic(() => import('@/components/Map/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] bg-slate-100 animate-pulse rounded-2xl flex flex-col items-center justify-center border border-slate-200">
      <div className="p-4 bg-white rounded-full shadow-sm mb-3">
        <MapIcon className="w-8 h-8 text-slate-300 animate-bounce" />
      </div>
      <p className="text-slate-400 font-medium text-sm">Memuat peta lokasi...</p>
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
      console.error(error);
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
      console.error(error);
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
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="h-[60vh] bg-slate-100 animate-pulse"></div>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div className="h-40 bg-slate-100 rounded-3xl animate-pulse"></div>
              <div className="h-96 bg-slate-100 rounded-3xl animate-pulse"></div>
            </div>
            <div className="h-96 bg-slate-100 rounded-3xl animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!region) return null;

  return (
    <div className="min-h-screen bg-white selection:bg-blue-100">
      <Navbar />
      
      <div className="relative h-[65vh] w-full overflow-hidden">
        {region.image ? (
          <img
            src={getImageUrl(region.image)}
            alt={region.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-slate-800"></div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>
        
        <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-10 max-w-7xl mx-auto w-full">
          <button
            onClick={() => router.back()}
            className="w-fit flex items-center gap-2 text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-all backdrop-blur-md border border-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Kembali</span>
          </button>
          
          <div className="space-y-4 animate-fade-in-up pb-8">
            <div className="flex items-center gap-2 text-white/90 text-sm font-medium tracking-wider uppercase">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span>{region.type === 'kota' ? 'Kota Madya' : 'Kabupaten'}</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight">
              {region.name}
            </h1>
            
            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-2 text-white/80">
                <Navigation className="w-5 h-5" />
                <span>{region.latitude}, {region.longitude}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <Info className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Tentang Wilayah</h2>
              </div>
              <p className="text-lg text-slate-600 leading-relaxed text-justify">
                {region.description}
              </p>
            </section>

            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                    <MapIcon className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Peta Lokasi</h2>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${region.latitude},${region.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Buka Google Maps <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              
              <div className="h-[400px] w-full rounded-3xl overflow-hidden shadow-lg border border-slate-100 relative z-0">
                {region.latitude && region.longitude ? (
                  <MapView
                    latitude={region.latitude}
                    longitude={region.longitude}
                    name={region.name}
                    zoom={11}
                    height="h-full"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center bg-slate-50 text-slate-400">
                    Koordinat tidak tersedia
                  </div>
                )}
              </div>
            </section>

            <section>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Destinasi Wisata</h2>
                  <p className="text-slate-500">Temukan {destinations.length} objek wisata menarik di {region.name}</p>
                </div>
                
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <div className="relative">
                    <select
                      value={filters.category_id}
                      onChange={(e) => setFilters(prev => ({ ...prev, category_id: e.target.value }))}
                      className="appearance-none bg-white border border-slate-200 text-slate-700 rounded-xl px-4 py-2.5 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-medium cursor-pointer hover:border-blue-300 transition-colors shadow-sm"
                    >
                      <option value="">Semua Kategori</option>
                      {categories.map((category) => (
                        <option key={category.category_id} value={category.category_id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <ChevronRight className="absolute right-3 top-3 w-4 h-4 text-slate-400 rotate-90 pointer-events-none" />
                  </div>

                  <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, view: 'grid' }))}
                      className={`p-2 rounded-lg transition-all ${
                        filters.view === 'grid' 
                          ? 'bg-white text-blue-600 shadow-sm' 
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, view: 'list' }))}
                      className={`p-2 rounded-lg transition-all ${
                        filters.view === 'list' 
                          ? 'bg-white text-blue-600 shadow-sm' 
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {destinations.length > 0 ? (
                <div className={filters.view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-6' : 'space-y-4'}>
                  {destinations.map((destination) => (
                    filters.view === 'grid' ? (
                      <div
                        key={destination.destination_id}
                        onClick={() => handleDestinationClick(destination.destination_id)}
                        className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full hover:-translate-y-1"
                      >
                        <div className="relative h-56 overflow-hidden">
                          <img
                            src={getImageUrl(destination.image)}
                            alt={destination.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                          <div className="absolute top-4 left-4">
                            {destination.category_name && (
                              <span className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm flex items-center gap-1.5">
                                <span>{destination.category_icon}</span>
                                {destination.category_name}
                              </span>
                            )}
                          </div>
                          {destination.ticket_price > 0 && (
                            <div className="absolute bottom-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
                              Rp {Number(destination.ticket_price).toLocaleString('id-ID')}
                            </div>
                          )}
                        </div>
                        <div className="p-5 flex flex-col flex-grow">
                          <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                            {destination.name}
                          </h3>
                          <div className="flex items-center text-sm text-slate-500 mb-4">
                            <MapPin className="w-4 h-4 mr-1.5 text-slate-400 shrink-0" />
                            <span className="truncate">{destination.address}</span>
                          </div>
                          <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between text-sm text-slate-400">
                            <div className="flex items-center">
                              <Eye className="w-4 h-4 mr-1.5" />
                              {destination.view_count || 0} views
                            </div>
                            <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
                              Detail <ChevronRight className="w-4 h-4 ml-0.5" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        key={destination.destination_id}
                        onClick={() => handleDestinationClick(destination.destination_id)}
                        className="group flex flex-col sm:flex-row bg-white rounded-2xl border border-slate-100 p-3 hover:shadow-lg hover:border-blue-100 transition-all cursor-pointer"
                      >
                        <div className="w-full sm:w-48 h-48 sm:h-36 rounded-xl overflow-hidden shrink-0 relative">
                          <img
                            src={getImageUrl(destination.image)}
                            alt={destination.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {destination.ticket_price > 0 && (
                            <span className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded-lg text-xs font-bold backdrop-blur-sm">
                              Rp {Number(destination.ticket_price).toLocaleString('id-ID')}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 mt-4 sm:mt-0 sm:ml-6 flex flex-col justify-center py-2">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{destination.name}</h3>
                              <p className="text-sm text-slate-500 flex items-center mt-1">
                                <MapPin className="w-3.5 h-3.5 mr-1.5" />
                                {destination.address}
                              </p>
                            </div>
                          </div>
                          <p className="text-slate-600 text-sm line-clamp-2 mb-4 pr-4">{destination.description}</p>
                          <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mt-auto">
                            {destination.category_name && (
                              <span className="bg-slate-100 px-2 py-1 rounded-md text-slate-700 flex items-center gap-1">
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
                <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <MapPin className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Belum ada destinasi</h3>
                  <p className="text-slate-500 text-sm">Coba ganti filter atau cek kembali nanti.</p>
                </div>
              )}
            </section>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-24">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-50">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Event Mendatang</h3>
                  <p className="text-xs text-slate-500">Jangan lewatkan keseruannya</p>
                </div>
              </div>
              
              {events.length > 0 ? (
                <div className="space-y-4">
                  {events.map((event) => {
                    const eventDate = new Date(event.event_date);
                    return (
                      <div
                        key={event.event_id}
                        onClick={() => handleEventClick(event.event_id)}
                        className="group flex gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer border border-transparent hover:border-slate-100"
                      >
                        <div className="shrink-0 bg-white text-slate-900 w-16 h-16 rounded-2xl flex flex-col items-center justify-center border border-slate-100 shadow-sm group-hover:border-blue-200 group-hover:text-blue-600 transition-colors">
                          <span className="text-xl font-bold leading-none">{eventDate.getDate()}</span>
                          <span className="text-[10px] uppercase font-bold mt-1 text-slate-400 group-hover:text-blue-400">
                            {eventDate.toLocaleString('id-ID', { month: 'short' })}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 py-1">
                          <h4 className="font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors text-sm mb-1">
                            {event.title}
                          </h4>
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              event.status === 'open' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {event.status === 'open' ? 'OPEN' : 'CLOSED'}
                            </span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {event.current_participants} joined
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 flex items-center gap-1 truncate">
                            <MapPin className="w-3 h-3 shrink-0" /> {event.meeting_point}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <button 
                    onClick={() => router.push(`/events?region_id=${id}`)}
                    className="w-full mt-4 py-3 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    Lihat Semua Event <ArrowLeft className="w-4 h-4 rotate-180" />
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-400 text-sm">Tidak ada event dalam waktu dekat.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}