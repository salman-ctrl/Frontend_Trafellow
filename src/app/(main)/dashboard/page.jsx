"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { getImageUrl } from '@/lib/utils';
import Navbar from "@/components/layout/Nav";
import toast from 'react-hot-toast';
import { 
  MapPin, Calendar, ArrowRight, Star, 
  Shield, Zap, Heart, Users, Clock 
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
        api.get('/events?limit=3')
      ]);
      
      setRegions(regionsRes.data.data);
      setDestinations(destinationsRes.data.data?.slice(0, 3) || []);
      setEvents(eventsRes.data.data?.slice(0, 3) || []);
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
        <div className="relative h-[60vh] mb-16 bg-slate-200 animate-pulse"></div>
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
      
      <section className="relative h-[70vh] mb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/background/dashboard/hero.png" 
            alt="West Sumatra" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-slate-50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4 max-w-4xl mx-auto">
          <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-1.5 rounded-full text-sm font-medium mb-6 uppercase tracking-wider">
            Explore West Sumatra
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Jelajahi Keindahan <br/> Ranah Minang
          </h1>
          <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-2xl leading-relaxed">
            Temukan destinasi wisata menakjubkan dan bergabung dengan komunitas pecinta wisata terbesar di Sumatera Barat.
          </p>
          <button 
            onClick={() => document.getElementById('explore').scrollIntoView({ behavior: 'smooth' })}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all hover:-translate-y-1 shadow-lg shadow-blue-600/30 flex items-center gap-2"
          >
            Mulai Jelajah <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      <section id="explore" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Jelajahi Wilayah</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Dari pegunungan yang sejuk hingga pantai yang memukau, pilih destinasi favoritmu berdasarkan wilayah.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {regions.map((region) => (
            <button
              key={region.region_id}
              onClick={() => handleRegionClick(region.region_id)}
              className="group relative h-64 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-left">
                <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur-sm rounded text-[10px] font-bold text-white mb-2 uppercase tracking-wide border border-white/10">
                  {region.type === 'kota' ? 'Kota' : 'Kabupaten'}
                </span>
                <h3 className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors">
                  {region.name}
                </h3>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="bg-white py-24 mb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Terpercaya & Aman</h3>
              <p className="text-gray-600">Semua informasi destinasi dan event telah diverifikasi oleh tim kami untuk keamanan Anda.</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Komunitas Aktif</h3>
              <p className="text-gray-600">Bergabunglah dengan ribuan traveler lain, bagikan pengalaman, dan cari teman perjalanan.</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Update Real-time</h3>
              <p className="text-gray-600">Dapatkan informasi terbaru mengenai event, harga tiket, dan kondisi lokasi wisata.</p>
            </div>
          </div>

          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">Destinasi Pilihan</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Sedang Trending</h2>
            </div>
            <button 
              onClick={() => router.push('/destinations')}
              className="hidden md:flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium transition-colors"
            >
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {destinations.map((destination) => (
              <div 
                key={destination.destination_id} 
                onClick={() => handleDestinationClick(destination.destination_id)}
                className="group cursor-pointer bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={getImageUrl(destination.image)}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold text-gray-900 flex items-center gap-1 shadow-sm">
                    <MapPin className="w-3 h-3 text-blue-600" />
                    {destination.region?.name}
                  </div>
                  <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-red-500 transition-colors">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {destination.name}
                    </h3>
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-bold text-yellow-700">{destination.rating || '4.8'}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-500 text-sm line-clamp-2 mb-6">
                    {destination.description || 'Nikmati keindahan alam yang memukau dengan pengalaman tak terlupakan.'}
                  </p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <div className="text-sm text-gray-500">
                      Mulai dari
                    </div>
                    <div className="text-lg font-bold text-blue-600">
                      {destination.ticket_price ? `Rp ${destination.ticket_price.toLocaleString('id-ID')}` : 'Gratis'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="bg-slate-900 rounded-[3rem] p-8 md:p-16 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-purple-600/20 to-transparent rounded-full blur-3xl"></div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-blue-400 font-bold tracking-wider uppercase text-sm">Agenda Minggu Ini</span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mt-4 mb-6 leading-tight">
                Jangan Lewatkan <br/> Event Seru
              </h2>
              <p className="text-slate-300 text-lg mb-8 leading-relaxed max-w-md">
                Bergabunglah dengan komunitas traveler lokal, ikuti festival budaya, 
                atau nikmati open trip eksklusif yang dikurasi khusus untuk Anda.
              </p>
              <button 
                onClick={() => router.push('/events')}
                className="bg-white text-slate-900 hover:bg-slate-100 font-bold px-8 py-4 rounded-xl transition-colors flex items-center gap-2"
              >
                Lihat Semua Jadwal <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {events.map((event) => {
                const eventDate = new Date(event.event_date);
                return (
                  <div 
                    key={event.event_id} 
                    onClick={() => handleEventClick(event.event_id)}
                    className="group bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 transition-all cursor-pointer flex items-center gap-6"
                  >
                    <div className="bg-slate-800 text-white w-20 h-20 rounded-xl flex flex-col items-center justify-center shrink-0 border border-slate-700">
                      <span className="text-2xl font-bold">{eventDate.getDate()}</span>
                      <span className="text-xs font-bold uppercase text-slate-400">
                        {eventDate.toLocaleString('id-ID', { month: 'short' })}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-500/20 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide border border-blue-500/20">
                          {event.status === 'open' ? 'Open Slot' : 'Full'}
                        </span>
                        <span className="text-slate-400 text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {event.event_time}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white truncate group-hover:text-blue-300 transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-slate-400 text-sm mt-1 flex items-center gap-1 truncate">
                        <MapPin className="w-3.5 h-3.5" /> {event.meeting_point}
                      </p>
                    </div>
                    
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/20 transition-colors shrink-0">
                      <ArrowRight className="w-5 h-5 text-white" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-blue-600 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Siap untuk Petualangan Barumu?</h2>
          <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
            Daftar sekarang untuk mendapatkan akses penuh ke fitur komunitas, membuat event sendiri, dan menyimpan destinasi favoritmu.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => router.push('/register')}
              className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-xl"
            >
              Daftar Gratis Sekarang
            </button>
            <button 
              onClick={() => router.push('/about')}
              className="px-8 py-4 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 transition-colors border border-blue-500"
            >
              Pelajari Lebih Lanjut
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RegionList;