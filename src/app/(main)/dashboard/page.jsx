"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { getImageUrl } from '@/lib/utils';
import Navbar from "@/components/layout/Nav";
import toast from 'react-hot-toast';
import { 
  MapPin, 
  Calendar, 
  ArrowRight, 
  Star, 
  Users, 
  TrendingUp,
  Compass,
  Map as MapIcon
} from "lucide-react";

const RegionList = () => {
  const router = useRouter();
  const [regions, setRegions] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [regionsRes, destinationsRes, eventsRes] = await Promise.all([
        api.get('/regions'),
        api.get('/destinations?limit=3'),
        api.get('/events?upcoming=true&limit=2')
      ]);
      
      setRegions(regionsRes.data.data);
      setDestinations(destinationsRes.data.data?.slice(0, 3) || []);
      setEvents(eventsRes.data.data?.slice(0, 2) || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const handleRegionClick = (regionId) => {
    router.push(`/regions/${regionId}`);
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
        <div className="relative h-[500px] mb-16 bg-slate-200 animate-pulse"></div>
        <div className="max-w-7xl mx-auto px-4 space-y-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-48 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <section className="relative h-[85vh] mb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/background/dashboard/hero.png" 
            alt="West Sumatra" 
            className="w-full h-full object-cover scale-105 animate-[kenburns_20s_ease-out_infinite]"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-slate-50"></div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-6 animate-fade-in-up">
            <Compass className="w-4 h-4" />
            <span>Discover West Sumatra's Hidden Gems</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight drop-shadow-lg">
            Jelajahi Keindahan <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              Ranah Minang
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl leading-relaxed">
            Temukan destinasi wisata menakjubkan, budaya yang kaya, dan bergabunglah dengan komunitas traveler terbesar di Sumatera Barat.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <button 
              onClick={() => document.getElementById('regions').scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Mulai Petualangan
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => router.push('/events')}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              Lihat Event
            </button>
          </div>
        </div>
      </section>

      <section id="regions" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 text-blue-600 font-semibold mb-2">
              <MapIcon className="w-5 h-5" />
              <span className="uppercase tracking-wider text-sm">Destinasi</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Jelajahi Wilayah</h2>
          </div>
          <button 
            onClick={() => router.push('/regions')}
            className="hidden md:flex items-center text-gray-500 hover:text-blue-600 font-medium transition-colors"
          >
            Lihat Semua <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {regions.map((region) => (
            <button
              key={region.region_id}
              onClick={() => handleRegionClick(region.region_id)}
              className="group relative h-64 md:h-80 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
            >
              {region.image ? (
                <img
                  src={getImageUrl(region.image)}
                  alt={region.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="absolute inset-0 bg-gray-200 w-full h-full" />
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity duration-300"></div>

              <div className="absolute bottom-0 left-0 right-0 p-6 text-left transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-medium text-white mb-3 border border-white/10">
                  {region.type === 'kota' ? 'Kota' : 'Kabupaten'}
                </span>
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">
                  {region.name}
                </h3>
                <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-300">
                  <p className="text-sm text-gray-300 mt-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                    Klik untuk jelajah
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 font-semibold mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="uppercase tracking-wider text-sm">Populer</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Destinasi Trending</h2>
          </div>
          <button 
            onClick={() => router.push('/destinations')}
            className="hidden md:flex items-center text-gray-500 hover:text-emerald-600 font-medium transition-colors"
          >
            Lihat Semua <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {destinations.map((destination) => (
            <div 
              key={destination.destination_id} 
              className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative h-64 overflow-hidden">
                {destination.image ? (
                  <img
                    src={getImageUrl(destination.image)}
                    alt={destination.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-blue-600" />
                    {destination.region?.name || 'Sumbar'}
                  </span>
                </div>
                <div className="absolute bottom-4 right-4">
                  <span className="bg-white/90 backdrop-blur-sm text-yellow-600 text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-500" />
                    {destination.rating || '4.8'}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {destination.name}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-6 leading-relaxed">
                  {destination.description || 'Nikmati keindahan alam yang memukau dengan pengalaman tak terlupakan.'}
                </p>
                
                <button 
                  onClick={() => handleDestinationClick(destination.destination_id)}
                  className="w-full py-3.5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-300 flex items-center justify-center gap-2 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white"
                >
                  Lihat Detail
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-gray-100 py-24 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-2 text-purple-600 font-semibold mb-2">
                <Calendar className="w-5 h-5" />
                <span className="uppercase tracking-wider text-sm">Agenda</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Jangan Lewatkan <br/> Event Seru Minggu Ini
              </h2>
              <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                Bergabunglah dengan komunitas traveler lokal, ikuti festival budaya, 
                atau nikmati open trip eksklusif yang dikurasi khusus untuk Anda.
              </p>
              <button 
                onClick={() => router.push('/events')}
                className="inline-flex items-center text-blue-600 font-bold hover:text-blue-800 transition-colors group"
              >
                Lihat Semua Jadwal
                <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="space-y-6">
              {events.map((event) => {
                const eventDate = new Date(event.event_date);
                return (
                  <div 
                    key={event.event_id} 
                    onClick={() => handleEventClick(event.event_id)}
                    className="group bg-white rounded-2xl border border-gray-100 p-4 hover:border-blue-100 hover:shadow-xl transition-all duration-300 cursor-pointer flex gap-6 items-center"
                  >
                    <div className="flex-shrink-0 bg-blue-50 text-blue-600 rounded-xl p-4 w-20 flex flex-col items-center justify-center border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                      <span className="text-2xl font-bold">{eventDate.getDate()}</span>
                      <span className="text-xs font-bold uppercase tracking-wider">
                        {eventDate.toLocaleString('id-ID', { month: 'short' })}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                          Open Trip
                        </span>
                        <span className="text-gray-400 text-xs flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {event.region?.name || 'Sumbar'}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                        {event.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1 gap-4">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1.5 text-gray-400" />
                          {event.max_participants || 20} Slot
                        </div>
                      </div>
                    </div>
                    
                    <div className="hidden sm:flex items-center justify-center h-10 w-10 rounded-full bg-gray-50 text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RegionList;